const mongoose = require('mongoose');
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const config = require('config');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        maxlength: 50,
        minlength: 5,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        minlength: 5,
        maxlength: 1024,
        required: true,
    },
    isAdmin: Boolean
})

userSchema.methods.generateAuthToken = function () {
    return jwt.sign({ _id: this._id, isAdmin: this.isAdmin }, config.get('jwtPrivateKey'));
}

const User = new mongoose.model('User', userSchema)


function validateUser(user) {
    const schema = {
        name: Joi.string().max(50).min(5).required(),
        email: Joi.string().max(40).min(7).required().email(),
        password: Joi.string().max(30).min(7).required()
    }

    return Joi.validate(user, schema);
}

exports.validate = validateUser;
exports.User = User;
