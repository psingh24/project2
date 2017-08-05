// Node Dependencies
var express = require("express");
var router = express.Router();
var models = require("../models");
var config = require("../db.js");
var mysql = require("mysql");
var connection = mysql.createConnection(config.mySQLKeys);
//validation for form errors
var expressValidator = require("express-validator");

var passport = require("passport")
//hash password
var bcrypt = require("bcrypt");
var saltRounds = 10;



// Create routes
// ----------------------------------------------------
router.get("/", function(req, res){
    // console.log(req.user);
    // console.log(req.isAuthenticated())
    res.render("register", { title: "Register"});
});

router.get("/main", function(req, res){
    // console.log(req.user);
    // console.log(req.isAuthenticated())
    res.render("main", { title: "Main"});
});

router.get("/profile", authenticationMiddleware(), function(req, res) {
    
    res.render("profile", { title: "Profile"});
});

router.get("/login", function(req, res) {
    res.render("login", { title: "Login"});
});



router.post("/login", passport.authenticate(
    "local", {
        successRedirect: '/profile',
        failureRedirect: '/login',
    }
    
));

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

        connection.query('Select LAST_INSERT_ID() as user_id', function(err, results, fields){
            if (err) throw err;

            var user_id = results[0]
            //creates sessions 
            console.log(user_id)
            req.logIn(user_id, function(err) {
                res.redirect("main")
            } );
    
        })


          
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

passport.serializeUser(function(user_id, done) {
  done(null, user_id);
});

passport.deserializeUser(function(user_id, done) {
  done(null, user_id);
 
});

//Checks if user is logged in
function authenticationMiddleware () {  
	return (req, res, next) => {
		console.log(`req.session.passport.user: ${JSON.stringify(req.session.passport)}`);
        //if true it renders next page
	    if (req.isAuthenticated()) return next();
	    res.redirect('/login')
	}
}

// ----------------------------------------------------

module.exports = router;
