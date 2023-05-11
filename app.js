//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const _ = require("lodash");

const mongoose = require("mongoose");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://Srihari:SrIhArI@cluster1.jeilw1a.mongodb.net/todolistDB")

const itemSchema = mongoose.Schema({
  name: String,
})

const item = mongoose.model("item", itemSchema);

const item1 = new item({
  name: "Welcome to your to-do list"
})

const item2 = new item({
  name: "Hit the add button to add"
})

const item3 =new item({
  name: "Hit the delete button to delte"
})

const defaultItems = [item1, item2, item3]
const listSchema = mongoose.Schema({
  name: String,
  item: [itemSchema]
})

const List = mongoose.model("List", listSchema);



app.get("/", function(req, res) {
   item.find({}).then((data)=>{
    if(data.length === 0 ){
      item.insertMany(defaultItems).then(()=>{
      console.log("Inserted Successfully")
    })
res.redirect("/");
  }
    else{

    res.render("list", {listTitle: "Today", newListItems: data});
  }
  })
  
});

app.post("/", function(req, res){

  const itemName = req.body.newItem;
  const listName = req.body.list;


  const it = new item({
    name: itemName
  })
  if(listName === "Today"){
    it.save();
    res.redirect("/");
  }
  else{
    List.findOne({name: listName}).then((data)=>{
      data.item.push(it);
      data.save();
      res.redirect("/" + listName);

    })
  }
})
app.post("/delete", function(req,res){
 const checked = req.body.checkbox;
 const listName = req.body.listName;
 if(listName === "Today"){
  item.findByIdAndRemove(checked).then(()=>{
    console.log("Successfuly deleted")
   });
   res.redirect("/");
 }
 else{
  List.findOneAndUpdate({name: listName}, {$pull: {item: {_id: checked}}}).then((data)=>{
    console.log("Successfully Del");
    res.redirect("/" + listName);
  })
 }
})

app.get("/:customListName", function(req,res){
  const customListName = _.capitalize(req.params.customListName);

  
  List.findOne({name: customListName}).then((foundList)=>{
    if(!foundList){
      const list = new List({
        name: customListName,
        item: defaultItems
      })
      
      list.save();
      res.redirect("/" + customListName)
    }
    else{
      res.render("list", {listTitle: foundList.name, newListItems: foundList.item});
    }
  })
  

});



app.get("/about", function(req, res){
  res.render("about");
});

app.listen(process.env.PORT || 3000, function() {
  console.log("Server started on port 3000");
});
