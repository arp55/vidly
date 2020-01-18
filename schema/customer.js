const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Joi = require('joi');

const customerSchema = new Schema({
    isGold: {
        type: Boolean,
        default: false
    },
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 30
    },
    phone: {
        type: String,
        required: true,
        maxlength: 10
    }
})

const Customer = mongoose.model('Customer', customerSchema);

function validateCustomer(customer) {
    const schema = {
        isGold: Joi.boolean(),
        name: Joi.string().min(3).max(30).required(),
        phone: Joi.string().max(10).required()
    }

    return Joi.validate(customer, schema);
}

module.exports.Customer = Customer;
module.exports.validateCustomer = validateCustomer;