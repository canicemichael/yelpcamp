const passport = require("passport");
const {userModel, validateUser} = require("../../models/user");

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    const currentUser = await userModel.findOne({id});
    done(null, currentUser);
});