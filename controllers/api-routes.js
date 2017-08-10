var express = require("express");
var router = express.Router();
var bodyParser = require("body-parser");



var db = require("../models");

module.exports = function(app) {
  var exphbs  = require('express-handlebars');
  app.engine('handlebars', exphbs({defaultLayout: 'main'}));
  app.set('view engine', 'handlebars');   

  app.get("/api/user", function(req, res) {
    // Here we add an "include" property to our options in our findAll query
    // We set the value to an array of the models we want to include in a left outer join
    // In this case, just db.Post
    db.user.findAll({
      include: [db.preferences],
    }).then(function(dbUser) {
      res.json(dbUser);
    });
  });

  app.get("/api/event", function(req, res) {
    // Here we add an "include" property to our options in our findAll query
    // We set the value to an array of the models we want to include in a left outer join
    // In this case, just db.Post
    db.event.findAll({
      include: [{
        model: db.user,
        through: {
          attributes:["userID"]
        }
        // include:[{
        //   model: db.eventSuggestions,
        //   through: {
        //     attributes:["eventID"]
        //   }
        // }]        
      }],
    }).then(function(dbEvent) {
      res.json(dbEvent);
    });
  });

  app.get("/api/event/suggestions", function(req, res) {
    // Here we add an "include" property to our options in our findAll query
    // We set the value to an array of the models we want to include in a left outer join
    // In this case, just db.Post
    db.event.findAll({
      include: [db.eventSuggestions],
    }).then(function(dbEvent) {
      res.json(dbEvent);
    });
  });

 app.get("/api/friend", function(req, res) {
    // Here we add an "include" property to our options in our findAll query
    // We set the value to an array of the models we want to include in a left outer join
    // In this case, just db.Post
    db.user.findAll({

      include: [{ 
        model: db.relationships,
        include: [{ model: db.user}]
      }],

    }).then(function(dbEvent) {
      res.json(dbEvent);
    });
  });

   //Morgan's routes -- Event page 
    app.get("/meetups", function(req, res) {
        db.event.findAll({

        }).then(function(getEvents) {
            var eventsObject = {
                event: getEvents
            };
            console.log(eventsObject);
            res.render("meetups", eventsObject);
        });
    });

    //Morgan's routes -- Event page 
    app.post("/meetups", function(req, res) {
        db.event.create({
            eventName: req.body.eventName,
            date: req.body.date,
            status: "open",
            totalAttendees: 0
        }).then(function(newEvent) {
            res.redirect("/main");
        });
          console.log("I'm trying to add a new event with the name "+req.body.eventName);
    });

    //Morgan's routes -- Individual meetup page 
    app.get("/:eventName", function(req, res) {

    });





};




// module.exports = router;