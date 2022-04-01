const addGoogleUser = (User) => ({ userName, email, password, isAdmin }) => {
    const user = new User({
        userName, email, password, isAdmin, source: "google"
    })
    return user.save()
}

const getUsers = (User) => () => {
    return User.find({})
}

const getUserByEmail = (User) => async ({ email }) => {
    return await User.findOne({ email })
}

const addLocalUser = (User) => ({ userName, email, password, isAdmin }) => {    
    const user = new User({
        userName, email, password, isAdmin, source: "local"
    })
    return user.save()
}

module.exports = (User) => {
    return {
        addLocalUser: addLocalUser(User),
        addGoogleUser: addGoogleUser(User),
        getUsers: getUsers(User),
        getUserByEmail: getUserByEmail(User)
    }
}