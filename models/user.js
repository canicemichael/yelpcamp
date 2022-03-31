const mongoose = require('mongoose');
const Joi = require('joi');

let Schema = mongoose.Schema;

const userSchema = new Schema({
    id: {
        type: String,

        default: null,
    },
    email: {
        type: String,
        required: [true, "email required"],
        unique: [true, "email already registered"],
    },
    firstName: String,
    lastName: String,
    profilePhoto: String,
    password: String,
    source: { type: String, required: [true, "source not specified"] },
    lastVisited: { type: Date, default: new Date() }
});

let userModel = mongoose.model("user", userSchema, "user");

module.exports = userModel;

// let UserSchema = new mongoose.Schema({
//     id: {
//         type: String,
//         default: null
//     },
//     username: {
//         type: String,
//         required: true,
//         unique: true
//     },
//     email: {
//         type: String,
//         required: true,
//         unique: true
//     },
//     password: {
//         type: String,
//         required: true
//     },
//     isAdmin: {
//         type: Boolean,
//         default: false
//     },
//     source: {type:String, required: [true, "source not specified"]},
// }, { timestamps: true });



// const User = mongoose.model('User', UserSchema);

// const validateUser = (data) => {
//     const schema = Joi.object({
//         username: Joi.string().required(),
//         email: Joi.string().required(),
//         password: Joi.string().required(),
//         isAdmin: Joi.boolean().default(false)
//     })
//     return schema.validate(data);
// }

// exports.User = User;
// exports.validateUser = validateUser;
