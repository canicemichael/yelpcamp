require("dotenv").config();

const express = require('express');
const app = express();
const cookieParser = require("cookie-parser");
const mongoose = require('mongoose');

const passport = require("passport");
const flash = require("express-flash");
const session = require("express-session");
const uuid = require("uuid");
const bcrypt = require('bcrypt');
const UserService = require("./models/user.index");

const Campground = require('./models/campground');
const {Comment} = require('./models/comment');
const seedDB = require('./seeds');
const port = process.env.PORT || 3000;
// const authRoute = require('./routes/auth');

require("./src/config/passport");
require("./src/config/google");
require("./src/config/local");

mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(()=> console.log('DB connection successful'))

seedDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

app.use(cookieParser());
// app.use('/api', authRoute);
app.use(
    session({
    secret: "secr3t",
    resave: false,
    saveUninitialized: true
}));

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

app.get("/", (req, res) => {
    res.render("landing");
})

const isLoggedIn = (req, res, next) => {
    req.user ? next() : res.sendStatus(401);
};

app.get('/local/signup', (req, res) => {
    res.render('local/signup.ejs');
});

app.post('/auth/local/signup', async(req, res) => {
    const { user_name, email, password, isAdmin } = req.body;
    console.log("got here1");
    if(password.length < 8) {
        req.flash("error", "Account not created. Password must be 7+ characters long");
        return res.redirect("/local/signup");
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    console.log("got here2");
    try {
        await UserService.addLocalUser({
            id: uuid.v4(),
            email,
            userName: user_name,
            isAdmin,
            password: hashedPassword
        })
    } catch (e) {
        req.flash("error", "Error creating a new account. Try again")
        console.log(e);
        return res.redirect("/local/signup")
    }

    return res.status(201).redirect('/local/signin');
});

app.get('/local/signin', (req, res) => {
    res.render('local/signin.ejs');
});

//LOGIN
app.post('/auth/local/signin',
    passport.authenticate('local', {
        successRedirect: '/campground/index',
        failureRedirect: '/local/signin',
        failureFlash: true
    })
);

app.get('/auth/logout', (req, res) => {
    req.flash("success", "Successfully logged out");
    req.session.destroy(function (){
        res.clearCookie("connect.sid");
        res.redirect("/");
    });
});














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

app.post("/campgrounds", isLoggedIn, async (req, res) => {
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
});


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


app.listen(port, () => {
    console.log(`Yelp Camp Server has started! at ${port}`);
})