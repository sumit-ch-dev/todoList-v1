// template for app
// Dependencies: express, body-parser, path

// Require express
const express = require("express");

// Require body-parser
const bodyParser = require("body-parser");


// Create express server

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());

// set view engine
app.set("view engine", "ejs");

// Set port

let PORT = process.env.PORT || 3000;

//get request
app.get("/", function(req, res) {
    let day = new Date();
    let currentDay = day.getDay();
    let today = "";
    //create an array of days
    let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    //loop through array and compare to current day
    for(let i = 0; i < days.length; i++) {
        if(currentDay === i) {
            today = days[i];
        }
    }

    // pass today variable to ejs file
    res.render("list", {kindOfDay: today});

})

// Listener

app.listen(PORT, function() {
    console.log("App listening on PORT: " + PORT);
})

