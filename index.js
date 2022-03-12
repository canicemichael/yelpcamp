const express = require('express');
const mongoose = require('mongoose');
const Campground = require('./models/campground');
const {Comment} = require('./models/comment');
const seedDB = require('./seeds');
const app = express();

const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

mongoose.connect("mongodb+srv://canice:canice@cluster0.anmxw.mongodb.net/yelp-camp?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true })
    .then(()=> console.log('DB connection successful'))

seedDB();

app.get('/', (req, res) => {
    res.render("landing");
});

app.get("/campgrounds", (req, res) => {
    Campground.find({}, (err, camps) => {
        if(err){
            console.log('error: ' + err);
        }else {
            res.render("campground/index", {campgrounds: camps});
        }
    });
});

app.post("/campgrounds", async (req, res) => {
    const camps = new Campground(req.body);
    await camps.save();
    res.redirect('/campgrounds');
});

app.get("/campgrounds/new", (req, res) => {
    res.render("campground/new");
});

app.get("/campgrounds/:id", (req, res) => {
    Campground.findById(req.params.id).populate("comments").exec((err, foundCampground) => {
        if(err){
            console.log('err: ' + err);
        } else {
            res.render("campground/show", {campground: foundCampground});
        }
    });
})


// =================================
// COMMENT SECTION
// =================================
app.get("/campgrounds/:id/comment/new", (req, res) => {
    Campground.findById(req.params.id, function(err,campground){
        if(err){
            console.log(err);
        } else {
            res.render("comment/new", { campground: campground });
        }
    })    
});

app.post("/campgrounds/:id/comment", (req, res) => {
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
            res.redirect('/campgrounds');
        } else {
            Comment.create(req.body.comment, function(err, comment){
                campground.comments.push(comment);
                campground.save();
                res.redirect('/campgrounds/' + campground._id);
            })
        }
    })
})

app.listen(port, () => {
    console.log('Yelp Camp Server has started!');
})