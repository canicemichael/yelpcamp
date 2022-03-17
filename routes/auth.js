const router = require('express').Router();
const { User, validateUser } = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

//show REGISTER form
router.get('/register', (req, res) => {
    res.render('register');
});

//REGISTER 
router.post('/register', async(req, res) => {
    const {error} = validateUser(req.body);
    if (error) return res.status(400).json(error.details[0].message);

    const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    });

    const salt = await bcrypt.genSalt(10);
    newUser.password = await bcrypt.hash(newUser.password, salt);
    await newUser.save();

    const savedUser = await newUser.save();
    res.status(201).redirect('/campgrounds');
});

//show login form
router.get('/login', (req, res) => {
    res.render('login');
});

//LOGIN
router.post('/login', async(req, res) => {
    const user = await User.findOne({username: req.body.username});
    if (!user) return res.redirect('/api/auth/login');

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) return res.redirect('/api/auth/login');

    const accessToken = jwt.sign(
        {
            id: user._id,
            isAdmin: user.isAdmin
        },
        process.env.JWT_SEC,
        {expiresIn: '3d'}
    );

    const { password, ...others } = user._doc;

    res.status(200).json({...others, accessToken});
});

//logout
router.get('/logout', (req, res) => {
    res.cookie('token', 'none', {
        httpOnly: true
    });

    res.status(200).json({
        success: true,
        data: {},
    });
});

module.exports = router;