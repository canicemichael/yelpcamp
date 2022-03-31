const mongoose = require('mongoose');
const Joi = require('joi');
let passportLocalMongoose = require("passport-local-mongoose");

let UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    source: {type:String, required: [true, "source not specified"]},
}, { timestamps: true });

UserSchema.plugin(passportLocalMongoose);

const User = mongoose.model('User', UserSchema);

const validateUser = (data) => {
    const schema = Joi.object({
        username: Joi.string().required(),
        email: Joi.string().required(),
        password: Joi.string().required(),
        isAdmin: Joi.boolean().default(false)
    })
    return schema.validate(data);
}

exports.User = User;
exports.validateUser = validateUser;
