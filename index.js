const express = require('express');
const mongoose = require('mongoose');
const Campground = require('./models/campground');
const seedDB = require('./seeds');
const app = express();

const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs");

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
            res.render("index", {campgrounds: camps});
        }
    });
});

app.post("/campgrounds", async (req, res) => {
    const camps = new Campground(req.body);
    await camps.save();
    res.redirect('/campgrounds');
});

app.get("/campgrounds/new", (req, res) => {
    res.render("new.ejs");
});

app.get("/campgrounds/:id", (req, res) => {
    Campground.findById(req.params.id).populate("comments").exec((err, foundCampground) => {
        if(err){
            console.log('err: ' + err);
        } else {
            res.render("show", {campground: foundCampground});
        }
    });
})

app.listen(port, () => {
    console.log('Yelp Camp Server has started!');
})