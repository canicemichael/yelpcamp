const passport = require("passport");
const User = require("../../models/user");

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    User.findById(id, function (err, user){
        done(err, user);
    });
    // const currentUser = await User.findOne({id});
    // done(null, currentUser);
});