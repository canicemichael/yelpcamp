const router = require("express").Router({mergeParams: true});
const Campground = require('../models/campground');
const {Comment} = require('../models/comment');
const middleware = require('../middleware/index');

router.get("/new", (req, res) => {
    Campground.findById(req.params.id, function(err,campground){
        if(err){
            console.log(err);
        } else {
            res.render("comments/new", { campground: campground });
        }
    })    
});

router.post("/", middleware.isLoggedIn, async (req, res) => {
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
            res.redirect('/campgrounds');
        } else {
            Comment.create(req.body.comment, function(err, comment){
                if (err){
                    req.flash("error", "Something went wrong");
                } else {
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
                req.flash("success", "Successfully added comment");
                res.redirect('/campgrounds/' + campground._id);
                }
            })
        }
    })
});

// COMMENT EDIT ROUTE
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
    Comment.findById(req.params.comment_id, function(err, foundComment){
        if(err){
            res.redirect("back");
        } else {
            res.render("comments/edit", {campground_id: req.params.id, comment: foundComment });
        }
    });    
});

// COMMENT UPDATE
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if(err){
            res.redirect("back");
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    })
});

// comment delete route
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            res.redirect("back");
        } else {
            req.flash("success", "Comment deleted");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});


module.exports = router;