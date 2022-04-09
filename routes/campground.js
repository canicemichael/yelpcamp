const router = require("express").Router();
const Campground = require('../models/campground');

router.get("/", isLoggedIn, (req, res) => {
    Campground.find({}, (err, camps) => {
        if(err){
            console.log('error: ' + err);
        }else {        
            res.render("campground/index", {campgrounds: camps, user: req.user});
        }
    });
});

router.post("/", isLoggedIn, async (req, res) => {
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
            console.log(newlyCreated);
            res.redirect('/campgrounds');
        }
    });
    // const camps = new Campground(req.body);
    // console.log(req.user);
    // await camps.save();
    // res.redirect('/campgrounds');
});

router.get("/new", isLoggedIn, (req, res) => {
    res.render("campground/new");
});

router.get("/:id", isLoggedIn, (req, res) => {
    Campground.findById(req.params.id).populate("comments").exec((err, foundCampground) => {
        if(err){
            console.log('err: ' + err);
        } else {
            res.render("campground/show", {campground: foundCampground});
        }
    });
});

// EDIT CAMPGROUND ROUTE
router.get("/:id/edit", (req, res) => {
    Campground.findById(req.params.id, function(err, foundCampground) {
        if (err){
            res.redirect('/campgrounds');
        } else{
            res.render("campground/edit", {campground: foundCampground});
        }
    });    
});

// UPDATE CAMPGROUND ROUTE
router.put("/:id", (req, res) => {
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
        if(err){
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    })
});

// DELETE CAMPGROUND ROUTE
router.delete("/:d", (req, res) => {
    Campground.findByIdAndRemove(req.params.id, (err) => {
        if (err) {
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds");
        }
    });
});

//middleware
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) return next();
    res.redirect('/local/signin');
    // req.user ? next() : res.redirect('/local/signin');
};

module.exports = router;