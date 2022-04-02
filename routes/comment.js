const router = require("express").Router({mergeParams: true});
const Campground = require('../models/campground');
const {Comment} = require('../models/comment');

router.get("/new", (req, res) => {
    Campground.findById(req.params.id, function(err,campground){
        if(err){
            console.log(err);
        } else {
            res.render("comment/new", { campground: campground });
        }
    })    
});

router.post("/", async (req, res) => {
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
            res.redirect('/campgrounds');
        } else {
            Comment.create(req.body.comment, function(err, comment){
                let ts = Date.now();
                let date_ob = new Date(ts);
                let datt = date_ob.getDate();                
                comment.date = datt;
                
                // add username and id to comment
                comment.author.id = req.user._id;
                comment.author.username = req.user.userName;
                // save comment
                comment.save();
                campground.comments.push(comment);
                campground.save();
                console.log(comment);
                res.redirect('/campgrounds/' + campground._id);
            })
        }
    })
});

//middleware
const isLoggedIn = (req, res, next) => {
    req.user ? next() : res.redirect('/local/signin');
};

module.exports = router;