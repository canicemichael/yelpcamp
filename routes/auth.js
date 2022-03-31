const router = require('express').Router();
const { User, validateUser } = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

app.get("/", (req, res) => {
    res.render("landing");
})

//show REGISTER form
router.get('/local/signup', (req, res) => {
    res.render('local/signup.ejs');
});

//REGISTER 
router.post('/auth/local/signup', async(req, res) => {
    const {error} = validateUser(req.body);
    if (error) return res.status(400).json(error.details[0].message);

    const {username, email, password} = req.body;

    if(password.length < 8) {
        req.flash("error", "Account not created. Password must be 7+ characters long");
        return res.redirect("/local/signup");
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    try {
        await UserService.addLocalUser({
            username: username,
            email: email,
            password: hashedPassword
        })
    } catch (e) {
        req.flash("error", "Error creating a new account. Try again")
        return res.redirect("/local/signup")
    }

    return res.status(201).redirect('/campgrounds');
});

//show login form
router.get('/local/signin', (req, res) => {
    res.render('local/signin.ejs');
});

//LOGIN
router.post('/auth/local/signin',
    passport.authenticate('local', {
        successRedirect: '/campgrounds',
        failureRedirect: '/local/signin',
        failureFlash: true
    })
);

//logout
router.get('/auth/logout', (req, res) => {
    req.flash("success", "Successfully logged out");
    req.session.destroy(function (){
        res.clearCookie("connect.sid");
        res.redirect("/");
    });
});

module.exports = router;