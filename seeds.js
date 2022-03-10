const mongoose = require("mongoose");
const Campground = require("./models/campground");
const { Comment } =  require("./models/comment");

const data = [
    {
        name: "Rainy Camp",
        image: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8Y2FtcHxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
        description: "what ever is the rain"
    },
    {
        name: "Desert Camp",
        image: "https://images.unsplash.com/photo-1496947850313-7743325fa58c?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTF8fGNhbXB8ZW58MHx8MHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
        description: "what ever is the rain"
    },
    {
        name: "Mountain Camp",
        image: "https://images.unsplash.com/photo-1496947850313-7743325fa58c?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTF8fGNhbXB8ZW58MHx8MHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
        description: "what ever is the rain"
    },
    {
        name: "Catalynk Stark",
        image: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8Y2FtcHxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
        description: "what ever is the rain"
    }
]

function seedDB(){
    //Remove all campgrounds
    Campground.deleteMany({}, function(err){
        if(err){
            console.log(err);
        } else {
            // console.log("removed campgrounds!");
            //add a few campgrounds
            data.forEach(function(seed){
                Campground.create(seed, function(err, campground){
                    if(err){
                        console.log(err);
                    } else {
                        // console.log("added a campgroumd");
                        //add a few comments
                        Comment.create({
                            text: "This place is great but i wish there was internet",
                            author: "Homer"
                        }, function(err, comment){
                            if(err){
                                console.log(err);
                            } else {
                                campground.comments.push(comment);
                                campground.save();
                                // console.log("Created new comment");
                            }
                        });
                    }
                });
            });
        }
    });
    
    
}

module.exports = seedDB;