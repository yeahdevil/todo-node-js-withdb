//jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");
const app = express();
//app use
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
//Db connect
mongoose.connect("mongodb://127.0.0.1/todolistDB",{useNewUrlParser:true});
let db = mongoose.connection;
db.on('open', () => {
  console.log("Connectes sucessfully to db");
});
db.on("error", function(err) {
  console.log("Could not connect to mongo server!");
  return console.log(err);
});
//mongoose Schema
const itemSchema = new mongoose.Schema(
  {
    item : String
  });
  const List = mongoose.model("list",itemSchema);
  const welcomeitem = new List({
    item:"Welcome to todo-list!"
  });
  const additem = new List({
    item:"Hit + to add item"
  });
  const delitem = new List({
    item:"<- hit here to del item"
  });
  const defaultList = [welcomeitem,additem,delitem];

  // const customListsSchema = new mongoose.Schema({
  //   name: String,
  //   items : [itemSchema]
  // });

  // const CustomLists = mongoose.model("customList",customListsSchema);
//get
app.get("/",function(req,res){
  // let day = new Date();
  // let options = {
  //   weekday:'long',
  //   day:'numeric',
  //   month:'long'
  // };
  //   let date = day.toLocaleString("en-US",options);
    List.find({},(err,data)=>{
      if(err) console.log(err);
      if(data.length === 0)
      {
        List.insertMany(defaultList);
        res.redirect("/");
      }
      res.render("list",{tittle:"Today",list:data});
    });

  });
  // app.get("/:customListName",function(req,res){
  //    let tittle = req.params.customListName;
  //    console.log('title is ' + tittle);
  //    CustomLists.find({name:"work"},function(err,foundlist){
  //      if(err)console.log(err);
  //      else{
  //        if(foundlist[0]){
  //          console.log(foundlist[0]);
  //          res.render("list",{tittle:tittle,list:foundlist[0].items});
  //        }
  //        else{
  //          // console.log(foundlist);
  //          // console.log(CustomLists);
  //          // console.log("not exist");
  //          console.log('out of list not found');
  //          let customList = new CustomLists({
  //            name:tittle,
  //            items: defaultList
  //          });
  //          customList.save();
  //          // console.log(customList.items);
  //          res.render("list",{tittle:tittle,list:customList.items});
  //        }
  //      }
  //    });
  //
  // });

  app.post("/",function(req,res){
    let button = req.body.button;
    let newitem = new List({
      item:req.body.item
    });
    // if(button=="Today")
    // {
      if(!req.body.item)
      {
        res.redirect("/");
      }
      else{
      newitem.save();
      res.redirect("/");
    }
    // }
    // else
    // {
    //   if(!req.body.item)
    //   {
    //     res.redirect("/"+button);
    //   }
    //   else{
    //     CustomLists.find({name:button},(err,found)=>{
    //       if(err) console.log(err);
    //       else{
    //         found[0].items.push(newitem);
    //         found[0].save();
    //         res.redirect("/"+button);
    //       }
    //     });
    //   }
    // }
    });
app.post("/delete",function(req,res){
  let delitemid = req.body.checkbox ;
  List.deleteOne({_id: delitemid},function(err){
    if(err) console.log(err);
    else{
      res.redirect("/");
    }
  });
});

app.listen(27017,function(err){
  if(err) console.log(err);
  console.log("listening on port 1000");
});
