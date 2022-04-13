const router = require("express").Router();
const bcrypt = require('bcrypt');
const UserService = require("../models/user.index");
const passport = require("passport");

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
        req.flash("error", e.message);
        return res.redirect("/local/signup")
    }
    req.flash("success", "SignUp Successful");
    return res.status(201).redirect('/local/signin');
});

// show login form
router.get('/local/signin', (req, res) => {
    res.render('local/signin.ejs');
});

// LOGIN
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
        res.redirect("/local/signin");
    });
});

module.exports = router;