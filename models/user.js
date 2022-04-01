const mongoose = require('mongoose');
const Joi = require('joi');

let Schema = mongoose.Schema;

const UserSchema = new Schema({
    userName: {
        type: String,
        required: [true, "username required"],
        unique: [true, "username not available"]
    },
    email: {
        type: String,
        required: [true, "email required"],
        unique: [true, "email already registered"]
    },
    password: {
        type: String,
        required: true
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    source: { type: String, required: [true, "source not specified"] },
    lastVisited: { type: Date, default: new Date() }
}, { timestamps: true });



let userModel = mongoose.model("user", UserSchema, "user");

const validateUser = (data) => {
    const schema = Joi.object({
        username: Joi.string().required(),
        email: Joi.string().required(),
        password: Joi.string().required(),
        isAdmin: Joi.boolean().default(false)
    })
    return schema.validate(data);
}

module.exports = userModel;
// exports.validateUser = validateUser;
