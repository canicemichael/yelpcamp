const router = require("express").Router();
const bcrypt = require('bcrypt');
const UserService = require("../models/user.index");
const passport = require("passport");
const flash = require("express-flash");

router.get("/", (req, res) => {
    res.render("landing");
});

router.get('/local/signup', (req, res) => {
    res.render('local/signup.ejs');
});

router.post('/auth/local/signup', async(req, res) => {
    const { user_name, email, password } = req.body;
    
    if(password.length < 8) {
        req.flash("error", "Account not created. Password must be 7+ characters long");
        return res.redirect("/local/signup");
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    
    try {
        await UserService.addLocalUser({            
            email,
            userName: user_name,            
            password: hashedPassword
        })
    } catch (e) {
        req.flash("error", "Error creating a new account. Try again")        
        return res.redirect("/local/signup")
    }

    return res.status(201).redirect('/local/signin');
});

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

router.get('/auth/logout', (req, res) => {
    req.flash("success", "Successfully logged out");
    req.session.destroy(function (){
        res.clearCookie("connect.sid");
        res.redirect("/");
    });
});

module.exports = router;