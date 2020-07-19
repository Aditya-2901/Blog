var express                         = require('express');
var app                             = express();
var mongoose                        = require('mongoose');
var bodyParser                      = require('body-parser');
var methodOverride                  = require("method-override");

mongoose.connect("mongodb://localhost:27017/blg");

app.set("view engine","ejs");
app.use(bodyParser.urlencoded({ extended: true}));
app.use(express.static('public'));
app.use(methodOverride("_method"));

//Schema

var blogSchema = new mongoose.Schema({
    image: String,
    title: String,
    body:  String,
    created: {type: Date , default: Date.now}
});

//model
 var Blog = mongoose.model("Blog" ,blogSchema);

 

 //Routes

app.get("/",function(req,res){
    res.redirect("/blogs");
});

app.get("/blogs",function(req,res){
    Blog.find({} , function(err,blogs){
        if(err){
        console.log("Error");
        }
        else{
            res.render("index", {blogs: blogs});
        }
    });
});

app.get("/blogs/new" , function(req,res){
    res.render("new");
});

app.post("/blogs",function(req,res){
   Blog.create(req.body.blog , function(err,newBlog){
       if(err){
           res.redirect("new");
       }else
           res.redirect("/blogs");
       
   });

});



app.get("/blogs/:id",function(req,res){


    Blog.findById(req.params.id , function(err,foundBlog){
        
       if(err){
           
        res.redirect("/blogs");

        }else{
            
            res.render("show" ,{blog: foundBlog});
        }
        
    });
});

app.get("/blogs/:id/edit" ,function(req,res){
Blog.findById(req.params.id ,function(err,editBlog){
    
    if(err){
    
        res.redirect("/blogs");
    }else{
    
        res.render("edit" ,{blog: editBlog});
    }

});
});

app.put("/blogs/:id" ,function(req,res){
    Blog.findByIdAndUpdate(req.params.id ,req.body.blog ,function(err,updateBlog){
        if(err){
            res.redirect("/blogs");
        }else{
            res.redirect("/blogs/" +req.params.id)
            
        }
    });
});

app.delete("/blogs/:id",function(req,res){
    console.log("stage 1");
    Blog.findByIdAndRemove(req.params.id,function(err){
        console.log("STAGE 2");
        if(err){
            console.log("stage 2 ");
            res.redirect("/blogs");
        }else{
            console.log("stage 3")
            res.redirect("/blogs");
        }
    });
});

app.listen(3000,function (){
    console.log("server is running");
});

