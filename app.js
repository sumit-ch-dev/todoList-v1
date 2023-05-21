// template for app
// Dependencies: express, body-parser, path

// Require express
const express = require("express");
const mongoose = require("mongoose");
const _ = require("lodash");
const { Schema } = mongoose;

const bodyParser = require("body-parser");

//const date = require(__dirname + "/date.js");


// Create express server

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());
app.use(express.static("public"));

// set view engine
app.set("view engine", "ejs");

//connect to mongodb with mongoose
const dbName = "todolistDB";

const mongoAtlasUri = "mongodb+srv://admin-sumit:come-on123@cluster0.5ensux9.mongodb.net/todolistDB?retryWrites=true&w=majority";


mongoose.connect(mongoAtlasUri, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => console.log("DB Connected!"))
    .catch(err => {
        console.log(err);
    });


const itemsSchema = new Schema({
    name: String
});

const Item = mongoose.model("Item", itemsSchema);

const item1 = new Item({
    name: "Welcome to your todolist!"
});

const item2 = new Item({
    name: "Hit the + button to add a new item."
});

const item3 = new Item({
    name: "<-- Hit this to delete an item."
});


const defaultItems = [item1, item2, item3];

const listSchema = new Schema({
    name: String,
    items: [itemsSchema]
});

const List = mongoose.model("List", listSchema)


//get request
app.get("/", function (req, res) {

    //const day = date.getDate();

    Item.find({}).then(foundItems => {
        if (foundItems.length == 0) {
            Item.insertMany(defaultItems).then(function () {
                //console.log("Successfully saved items to DB");
            }).catch(function (err) {
                console.log(err);
            });
            res.redirect("/");
        } else {
            //console.log("rerendering")
            res.render("list", { listTitle: "Today", newListItem: foundItems });
        }
    }).catch(err => console.log(err));

})

//handle post request from form
app.post("/", function (req, res) {
    const itemName = req.body.newItem;
    const listName = req.body.list;
    //console.log(listName);

    const item = new Item({
        name: itemName
    });

    if(listName === "Today") {
        item.save().then(function () {
            res.redirect("/");
        }).catch(function (err) {
            console.log(err);
        })
    } else {
        List.findOne({ name: listName }).then(function (foundList) {
            foundList.items.push(item);
            //console.log(foundList);
            foundList.save().then(function () {
                res.redirect("/" + listName);
            }).catch(function (err) {
                console.log(err);
            })
        })
    }
})


app.post("/delete", function (req, res) {
    const checkedItemId = req.body.checkbox
    const listName = req.body.listName;
    //console.log(listName);

    if(listName === "Today") {
        Item.findByIdAndRemove(checkedItemId).then(function () {
            //console.log("Successfully deleted checked item.");
            res.redirect("/");
        }).catch(function (err) {
            console.log(err);
        })
    } else { 
        List.findOneAndUpdate({ name: listName }, { $pull: { items: { _id: checkedItemId } } }).then(function (foundList) {
            foundList.save().then(function () {
                res.redirect("/" + listName);
            }).catch(function (err) {
                console.log(err);
            })
        })
    }   
})

app.get("/:customListName", function (req, res) {
    const customListName = req.params.customListName;

    //use lodash to convert first letter to uppercase
    const listName = _.capitalize(customListName);
    //don't add duplicate lists

    List.findOne({ name: listName }).then(function (foundList) {
        if(!foundList) {
            //create a new list
            const list = new List({
                name: listName,
                items: defaultItems
            });
        
            list.save().then(function () {
                res.redirect("/" + listName);
            }).catch(function (err) {
                console.log(err);
            })
        } else {
            //show an existing list
            res.render("list", { listTitle: foundList.name, newListItem: foundList.items });
        }
    });

})

app.post("/work", function (req, res) {
    const item = req.body.newItem;
    workItems.push(item);
    res.redirect("/work");
})

app.get("/about", function (req, res) {
    res.render("about");
})

// Set port

const PORT =  3000;

// Listener

app.listen(PORT, function () {
    console.log("App listening on PORT: " + PORT);
})

