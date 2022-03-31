const addGoogleUser = (User) => ({ username, email, password, isAdmin }) => {
    const user = new User({
        username, email, password, isAdmin, source: "google"
    })
    return user.save()
}

const getUsers = (User) => () => {
    return User.find({})
}

const getUserByEmail = (User) => async ({ email }) => {
    return await User.findOne({ email })
}

const addLocalUser = (User) => ({ username, email, password, isAdmin }) => {
    const user = new User({
        username, email, password, isAdmin, source: "local"
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