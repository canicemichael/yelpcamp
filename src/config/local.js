//  Set up Passport for Local Sign In
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const UserService = require('../../models/user.index');
const bcrypt = require('bcrypt');
const User = require('../../models/user');


passport.use(new LocalStrategy(
    function(username, password, done) {
        User.findOne({ userName: username }, function(err, user) {
            if (err) { return done(err); }
            if (!user) { return done(null, false, { message: 'Incorrect username.' }); }
    
            bcrypt.compare(password, user.password, function(err, res) {
                if (err) return done(err);
                if (res === false) return done(null, false, {message: 'Incorrect password'});
    
                return done(null, user);
            });
        });
    }

    // async function (email, password, done) {        
    //     let currentUser = await UserService.getUserByEmail({email})        
        
        

    //     const getUserByEmail = (User) => async ({ email }) => {
    //         return await User.findOne({ email })
    //     }

    //     if (!currentUser) {
    //         return done(null, false, { message: `User with email ${email} does not exist` });
    //     }

    //     if (currentUser.source != "local") {
    //         return done(null, false, { message: `You have previously signed up with a different signin method` });
    //     }
    //     console.log("currentuser", currentUser)
    //     if (!bcrypt.compareSync(password, currentUser.password)) {
    //         return done(null, false, { message: `Incorrect password provided` });
    //     }
    //     return done(null, currentUser);
    // }
));