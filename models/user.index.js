const {userModel} = require('./user');
const UserService = require('./user.service');

module.exports = UserService(userModel);