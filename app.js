const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");

const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/todolistDB");

const itemsSchema = {
  name: {
    type: String
  }
}

const Item = mongoose.model("Item", itemsSchema);

const item1 = new Item({
  name: "Welcome to your Todolist!"
});
const item2 = new Item({
  name: "Hit the + button to add a new list"
});
const item3 = new Item({
  name: "<-- Check this to delete a list"
});

const defaultItems = [item1, item2, item3];

app.get("/", function(req,res){
  Item.find({},function(err,foundItems){
    if(foundItems.length===0){
      Item.insertMany(defaultItems, function(err){
        if(err){
          console.log(err);
        } else{
          console.log("Sucessfully saved default items to DB.");
        }
      });
      res.redirect("/");
    } else{
      res.render("list", {newListItems: foundItems})
    }
  });
});

app.post("/", function(req,res){
  const itemName = req.body.newItem;

  const item = new Item({
    name: itemName
  });
  item.save();
  res.redirect("/");
});

app.post("/delete", function(req,res){
  const checkedItemId = req.body.checkbox;
  Item.findByIdAndRemove(checkedItemId, function(err){
    if(!err){
        console.log("Sucessfully deleted checked item.");
        res.redirect("/");
    }
  });
});

app.listen(process.env.PORT||3000, function() {
  console.log("Server is running on port 3000.")
});
