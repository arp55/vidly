const mongoose = require('mongoose');
const Joi = require('joi');

const Rental = new mongoose.model('Rental', new mongoose.Schema({
    customer: {
        type: new mongoose.Schema({
            name: {
                type: String,
                maxlength: 30,
                minlength: 5,
                required: true
            },
            isGold: {
                type: Boolean,
                default: false
            },
            phone: {
                type: String,
                maxlength: 10,
                required: true
            }
        }),
        required: true
    },
    dateTaken: {
        type: Date,
        default: Date.now,
        required: true
    },
    dateReturn: {
        type: Date,
    },
    rentalFee: {
        type: Number
    },
    movie: {
        type: new mongoose.Schema({
            title: {
                type: String,
                maxlength: 40,
                minlength: 5,
                required: true
            },
            dailyRentalRate: {
                type: Number
            }
        }),
        required: true
    }
}))

function validateRental(rental) {
    const schema = {
        customerId: Joi.objectId().max(40).min(5).required(),
        movieId: Joi.objectId().max(40).min(5).required()
    }

    return Joi.validate(rental, schema);
}

exports.Rental = Rental;
exports.validate = validateRental;