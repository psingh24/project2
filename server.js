
// Node Dependencies
var express = require('express');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var expressValidator = require('express-validator');


//database
var mysql = require("mysql");
var config = require("./db.js");

var connection = mysql.createConnection(config.mySQLKeys);


//Authentication packages
var session = require("express-session");
var passport = require("passport");

//using local database
var LocalStrategy = require('passport-local').Strategy;

var MySQLStore = require('express-mysql-session')(session);

var bcrypt = require("bcrypt");



// Set up Express
var app = express();

var db = require("./models")



//Serve static content for the app from the "public" directory in the application directory.

app.use(express.static('public'));

// Parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

app.use(expressValidator()); // this line must be immediately after any of the bodyParser middlewares!

var sessionStore = new MySQLStore(config.mySQLKeys);


//session handling
app.use(session({
  secret: 'jehrfgejrhfge',
  resave: false,
  store: sessionStore,
  saveUninitialized: false,
//   cookie: { secure: true }
}));
//init passport-- also test if user is logged in
app.use(passport.initialize());
app.use(passport.session());

// Handlebars
var exphbs = require('express-handlebars');
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');


app.use(function(req, res, next) {
    res.locals.isAuthenticated = req.isAuthenticated();
    next();
})
var routes = require('./controllers/user.js');
app.use('/', routes);

// require('./controllers/burgers_controllers.js')(app);


passport.use(new LocalStrategy(
  function(username, password, done) {
    console.log(username, password);

    connection.query("SELECT id, password FROM User WHERE username = ?", [username], function(err, results, fields){
            if (err) done(err)
                // console.log(results)

            if (results.length === 0) {
                done(null, false)
            }
            else {
                  var hash = results[0].password.toString();
           
            bcrypt.compare(password, hash, function(err, response) {
                if (response === true) {
                    return done(null, [results[0].id, username]);
                } else {
                    done(null, false)
                }
            })

            }
          

    })



      

  }
));


var port = process.env.PORT || 3000;

// db.sequelize.sync().then(function() {
app.listen(port, function(){
  console.log('Listening on port ' + port);
});
// })


// Hey I had two questions about passport. First I intend to deploy my app on heroku and the name of local Strategy is causing some confusion. You mentioned in the tutorial that we use a local Strategy because we have a local db. Once it is deployed to heroku, the db can no longer be local. I'll be using their jawsDb mysql add on, will the local strategy still work with that? 

// Second question, and this might be a stupid one. So i can get a User to sign in and redirect to the profile page. From there how would I pull info from the Database about the user and display it on the screen. 

// router.post("/login", passport.authenticate(
//     "local", {
//         successRedirect: '/profile',
//         failureRedirect: '/login',
//     }
    
// ));

// I tried do this:

// router.post('/login',
//   passport.authenticate('local'),
//   function(req, res) {
//     // If this function gets called, authentication was successful.
//     // `req.user` contains the authenticated user.
//     res.redirect('/login', {username: req.user});
//   });

//   but you cant seem to pass any info the redirect method. I always get an Error.
