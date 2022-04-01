require("dotenv").config();

const express = require('express');
const app = express();
const cookieParser = require("cookie-parser");
const mongoose = require('mongoose');

const passport = require("passport");
const flash = require("express-flash");
const session = require("express-session");

const seedDB = require('./seeds');
const port = process.env.PORT || 3000;

const authRoute = require('./routes/auth');
const campgroundRoute = require('./routes/campground');
const commentRoute = require('./routes/comment');

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

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    next();
});

app.use("/", authRoute);
app.use("/campgrounds", campgroundRoute);
app.use("/campgrounds/:id/comment", commentRoute);


app.listen(port, () => {
    console.log(`Yelp Camp Server has started! at ${port}`);
})