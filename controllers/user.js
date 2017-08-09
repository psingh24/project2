// Node Dependencies
var express = require("express");
var router = express.Router();
var bodyParser = require("body-parser");
//image upload
var fileUpload = require("express-fileupload");
var path = require("path");

//models 
var models = require("../models");

//SQL tie-ins
var config = require("../db.js");
var mysql = require("mysql");
var connection = mysql.createConnection(config.mySQLKeys);

//validation for form errors
var expressValidator = require("express-validator");

//Secured routing
var passport = require("passport");

//hash password
var bcrypt = require("bcrypt");
var saltRounds = 10;

// Create routes
// ----------------------------------------------------
router.get("/", function(req, res) {
  // console.log(req.user);
  // console.log(req.isAuthenticated())
  res.render("register", { title: "Register" });
});


router.get("/main", authenticationMiddleware(), function(req, res) {
  console.log(req.user);
  var arrayofMembers = [];
  var arrayId = [];
  var user = req.user;

  var index;
  connection.query("SELECT id, username FROM User", function(
    err,
    results,
    fields
  ) {
    if (err) throw err;
    // console.log(results)
    for (var i = 0; i < results.length; i++) {
      arrayofMembers.push(results[i].username);
      arrayId.push(results[i].id);
    }

    var index = arrayofMembers.indexOf(req.user[1]);

    var idIndex = arrayId.indexOf(req.user[0]);

    if (index > -1) {
      arrayofMembers.splice(index, 1);
    }
    if (idIndex > -1) {
      arrayId.splice(idIndex, 1);
    }

    res.render("main", {
      username: req.user[1],
      members: arrayId
    });

    // if (typeof user === "string") {
    //   res.render("main", {
    //     username: req.user,
    //     members: arrayId
    //   });
    // } else {
    //   res.render("main", {
    //     username: req.user[1],
    //     members: arrayId
    //   });
    // }
  });

  //   var user = req.user;
  //   if (typeof user === "string") {
  //     res.render("main", { username: req.user });
  //   } else {
  //     res.render("main", { username: req.user[1] });
  //   }
  // res.render("main", { username: req.user[1]});
});

router.post("/main", authenticationMiddleware(), function(req, res) {
  var userOne = req.user[0];
  var userTwo = req.body.id;

  console.log(userOne, userTwo);
  console.log("test");



  connection.query(
    "INSERT INTO relationship (user_one_id, user_two_id, status, action_user_id) VALUES (?, ?, ?, ?)",
    [userOne, userTwo, "Pending", userOne],
    function(err, results, fields) {
      if (err) throw err;
      console.log(results);
    }
  );

  res.redirect("main");
});

router.post("/profile", authenticationMiddleware(), function(req, res, next) {
  // req.file is the `avatar` file
  // req.body will hold the text fields, if there were any

  // res.send(res.file)
  var user = req.user;
  //Image upload
  if (!req.files) {
    res.send("No files");
  } else {
    var file = req.files.image;
    var extension = path.extname(file.name);

    if (extension !== ".PNG" && extension !== ".GIF" && extension !== ".JPG") {
      res.send("Only Images");
    } else {
      file.mv("./public/uploads/" + file.name, function(err) {
        if (err) throw err;
        var image = req.files.image.name;
        connection.query(
          "UPDATE USER set image = ? WHERE id= ?",
          [image, req.user[0]],
          function(err, results) {
            if (err) throw err;
            console.log(results);
          }
        );

        connection.query(
          "SELECT * From User INNER JOIN (SELECT userA.id AS userA_id, userA.username AS userA_username, userB.id AS userB_id, userB.username AS userB_username, status, action_user_id, userC.username AS action_user_username FROM relationship INNER JOIN User AS userA ON userA.id = relationship.user_one_id INNER JOIN User AS userB ON userB.id = relationship.user_two_id INNER JOIN User AS userC ON userC.id = relationship.action_user_id WHERE (userA.id = ? OR userB.id = ?) AND userC.id != ? AND status = 'Pending') as T2 ON User.ID = T2.userB_id;",
          [user[0], user[0], user[0]],
          function(err, data) {
            if (err) throw err;

            connection.query(
              "SELECT User.username, User.image FROM User INNER JOIN relationship ON User.id=relationship.user_one_id WHERE relationship.status = 'Accepted' AND relationship.user_two_id = ?",
              [user[0]],
              function(err, data2) {
                if (err) throw err;
                console.log(data);

                if (data.length === 0) {
                  res.render("profile", {
                    data: { name: user[1], image: image, friends: data2 }
                  });
                } else {
                  res.render("profile", {
                    data: {
                      profile: data,
                      image: data[0].image,
                      name: data[0].userB_username,
                      friends: data2
                    }
                  });
                }
              }
            );
          }
        );
      });
    }
  }
});

router.get("/profile", authenticationMiddleware(), function(req, res) {
  console.log(req.user);

//   models.User.findAll({ where: {id: req.user[0]}}).then(function(data){console.log(data)})

  var user = req.user;
  connection.query("SELECT image FROM User WHERE id = ?", [user[0]], function(
    err,
    results
  ) {
    if (err) throw err;
    var image = results[0].image;

    connection.query(
      "SELECT * From User INNER JOIN (SELECT userA.id AS userA_id, userA.username AS userA_username, userB.id AS userB_id, userB.username AS userB_username, status, action_user_id, userC.username AS action_user_username FROM relationship INNER JOIN User AS userA ON userA.id = relationship.user_one_id INNER JOIN User AS userB ON userB.id = relationship.user_two_id INNER JOIN User AS userC ON userC.id = relationship.action_user_id WHERE (userA.id = ? OR userB.id = ?) AND userC.id != ? AND status = 'Pending') as T2 ON User.ID = T2.userB_id;",
      [user[0], user[0], user[0]],
      function(err, data) {
        if (err) throw err;

        connection.query(
          "SELECT User.username, User.image FROM User INNER JOIN relationship ON User.id=relationship.user_one_id WHERE relationship.status = 'Accepted' AND relationship.user_two_id = ?",
          [user[0]],
          function(err, data2) {
            if (err) throw err;
            console.log(data2);

            if (data.length === 0) {
              res.render("profile", {
                data: { name: user[1], image: image, friends: data2 }
              });
            } else {
              res.render("profile", {
                data: {
                  profile: data,
                  image: data[0].image,
                  name: data[0].userB_username,
                  friends: data2
                }
              });
            }
          }
        );
        // console.log(data);
      }
    );
  });
});

router.post("/update/:id", authenticationMiddleware(), function(req, res) {
  console.log(req.params.id);
  var sender = req.params.id;
  var user = req.user[0];

  connection.query(
    "UPDATE relationship SET status = ?, action_user_id = ? WHERE user_one_id = ? AND user_two_id = ?",
    ["Accepted", user, sender, user],
    function(err, results, fields) {
      if (err) throw err;
      console.log(results);
      res.redirect("/profile");
    }
  );
});

router.get("/login", function(req, res) {
  res.render("login", { title: "Login" });
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/profile",
    failureRedirect: "/register"
  })
);

// router.post("/login", passport.authenticate("local"), function(req, res) {
//   // If this function gets called, authentication was successful.
//   // `req.user` contains the authenticated user.
//   res.redirect("/profile");
// });

router.get("/logout", function(req, res) {
  req.logout();
  req.session.destroy();
  res.redirect("/login");
});

router.get("/register", function(req, res) {
  res.render("register", { title: "Registration" });
});

router.post("/register", function(req, res) {
  //Going to be adding user to database
  //Validation
  // ----------------------------------------------------
  req.checkBody("username", "Username field cannot be empty.").notEmpty();
  req
    .checkBody("username", "Username must be between 4-15 characters long.")
    .len(4, 15);
  req
    .checkBody("email", "The email you entered is invalid, please try again.")
    .isEmail();
  req
    .checkBody(
      "email",
      "Email address must be between 4-100 characters long, please try again."
    )
    .len(4, 100);
  req
    .checkBody("password", "Password must be between 8-100 characters long.")
    .len(8, 100);
  req
    .checkBody(
      "password",
      "Password must include one lowercase character, one uppercase character, a number, and a special character."
    )
    .matches(
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.* )(?=.*[^a-zA-Z0-9]).{8,}$/,
      "i"
    );
  req
    .checkBody(
      "passwordMatch",
      "Password must be between 8-100 characters long."
    )
    .len(8, 100);
  req
    .checkBody("passwordMatch", "Passwords do not match, please try again.")
    .equals(req.body.password);

  // Additional validation to ensure username is alphanumeric with underscores and dashes
  req
    .checkBody(
      "username",
      "Username can only contain letters, numbers, or underscores."
    )
    .matches(/^[A-Za-z0-9_-]+$/, "i");

  var errors = req.validationErrors();

  if (errors) {
    console.log(`errors: ${JSON.stringify(errors)}`);

    res.render("register", {
      title: "Registration Error",
      errors: errors
    });
  } else {
    var username = req.body.username;
    var email = req.body.email;
    var password = req.body.password;

    bcrypt.hash(password, saltRounds, function(err, hash) {
      // Store hash in your password DB.
      connection.query(
        "INSERT INTO User (username, email, password) VALUES (?, ?, ?)",
        [username, email, hash],
        function(err, results, fields) {
          if (err) throw err;

          connection.query("Select LAST_INSERT_ID() as user_id", function(
            err,
            results,
            fields
          ) {
            if (err) throw err;

            var user_id = results[0].user_id;
            //creates sessions
            console.log(user_id);
            req.logIn([user_id, username], function(err) {
              res.redirect("main");
            });
          });
        }
      );
    });
  }
  // ----------------------------------------------------

  //   models.User
  //     .create({
  //       username: username,
  //       email: email,
  //       password: password
  //     })
  //     .then(function() {
  //       res.render("index", { title: "Registration Complete" });
  //     });
});


router.post("/:username", authenticationMiddleware(), function(req, res){
    // console.log(req.params.username)

    var username = req.params.username

    connection.query("SELECT User.username, User.id, User.image From USER WHERE User.username = ?", [username], function(err, results, fields) {
        if (err) throw err;

        res.render("userprofile", {data: { name: username, image: results[0].image }})

    })
// res.render("userprofile")
    
})
















passport.serializeUser(function(user_id, done) {
  done(null, user_id);
});

passport.deserializeUser(function(user_id, done) {
  done(null, user_id);
});

//Checks if user is logged in
function authenticationMiddleware() {
  return (req, res, next) => {
    console.log(
      `req.session.passport.user: ${JSON.stringify(req.session.passport)}`
    );
    //if true it renders next page
    if (req.isAuthenticated()) return next();
    res.redirect("/login");
  };
}

// ----------------------------------------------------

module.exports = router;
