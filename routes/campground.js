const router = require("express").Router();
const Campground = require('../models/campground');

router.get("/",  (req, res) => {
    Campground.find({}, (err, camps) => {
        if(err){
            console.log('error: ' + err);
        }else {        
            res.render("campground/index", {campgrounds: camps});
        }
    });
});

router.post("/", async (req, res) => {
    let name = req.body.name;
    let image = req.body.image;
    let desc = req.body.description;
    let author = {
        id: req.user._id,
        username: req.user.userName
    }
    let newCamps = {name: name, image: image, description: desc, author: author}

    // Create a new campground and save to DB
    Campground.create(newCamps, (err, newlyCreated) => {
        if(err){
            console.log(err);
        } else {
            res.redirect('/campgrounds');
        }
    });
    // const camps = new Campground(req.body);
    // console.log(req.user);
    // await camps.save();
    // res.redirect('/campgrounds');
});

router.get("/new", (req, res) => {
    res.render("campground/new");
});

router.get("/:id", (req, res) => {
    Campground.findById(req.params.id).populate("comments").exec((err, foundCampground) => {
        if(err){
            console.log('err: ' + err);
        } else {
            res.render("campground/show", {campground: foundCampground});
        }
    });
});

//middleware
const isLoggedIn = (req, res, next) => {
    req.user ? next() : res.redirect('/local/signin');
};

module.exports = router;