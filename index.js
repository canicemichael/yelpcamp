const express = require('express');
const mongoose = require('mongoose');
// passport usage
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");
const Campground = require('./models/campground');
const {Comment} = require('./models/comment');
const seedDB = require('./seeds');
const dotenv = require('dotenv');
const { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin } = require('./middleware/verifyToken');
const app = express();

const authRoute = require('./routes/auth');;

const port = process.env.PORT || 3000;

dotenv.config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/auth', authRoute);

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

mongoose.connect("mongodb+srv://canice:canice@cluster0.anmxw.mongodb.net/yelp-camp?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true })
    .then(()=> console.log('DB connection successful'))

seedDB();

//PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "secr3t",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
// passport.use(new LocalStrategy(User.authenticate()));
// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());

app.get('/', (req, res) => {
    res.render("landing");
});

app.get("/campgrounds",  (req, res) => {
    Campground.find({}, (err, camps) => {
        if(err){
            console.log('error: ' + err);
        }else {
            res.render("campground/index", {campgrounds: camps});
        }
    });
});

app.post("/campgrounds",  async (req, res) => {
    const camps = new Campground(req.body);
    await camps.save();
    res.redirect('/campgrounds');
});

app.get("/campgrounds/new",  (req, res) => {
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

app.post("/campgrounds/:id/comment", async (req, res) => {
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
                // console.log(comment);
                campground.comments.push(comment);
                campground.save();
                res.redirect('/campgrounds/' + campground._id);
            })
        }
    })
});

// ==============================
// AUTH ROUTES
// ==============================

//  show register form
app.get("/register", (req, res) => {
    res.render("register");
});

// handle signup logic
app.post("/register", (req, res) => {
    // registering user logic here
});

// show login form
app.get("/login", (req, res) => {
    res.render("login");
});

// handling login logic
app.post("/login", (req, res) => {
    // login logic happens here
})

app.listen(port, () => {
    console.log(`Yelp Camp Server has started! at ${port}`);
})