// template for app
// Dependencies: express, body-parser, path

// Require express
const express = require("express");

// Require body-parser
const bodyParser = require("body-parser");

const date = require(__dirname + "/date.js");


// Create express server

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());
app.use(express.static("public"));

// set view engine
app.set("view engine", "ejs");

// Set port

let PORT = process.env.PORT || 3000;

let items = []
let workItems = []
//get request
app.get("/", function(req, res) {
    
    let day = date();

    res.render("list", {listTitle: day, newListItem: items});
})

//handle post request from form
app.post("/", function(req, res) {
    if(req.body.list === "Work") {
        workItems.push(req.body.newItem);
        res.redirect("/work");
    } else {
        items.push(req.body.newItem);
    }
    res.redirect("/");
})

app.get("/work", function(req, res) {
    res.render("list", {listTitle: "Work List", newListItem: workItems});
})

app.post("/work", function(req, res) {
    let item = req.body.newItem;
    workItems.push(item);
    res.redirect("/work");
})

app.get("/about", function(req, res) {
    res.render("about");
})  


// Listener

app.listen(PORT, function() {
    console.log("App listening on PORT: " + PORT);
})

