const mongoose = require('mongoose');
const { genreSchema } = require('./genre');
const Joi = require('joi')

const movieSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    genre: {
        type: [genreSchema],
        required: true
    },
    numberInStock: Number,
    dailyRentalRate: Number
})

function validateMovie(movie) {
    const schema = {
        title: Joi.string().min(5).max(200).required(),
        genreId: Joi.objectId().required(),
        numberInStock: Joi.number().min(0).required(),
        dailyRentalRate: Joi.number().min(0).required()
    };
    return Joi.validate(movie, schema);
}

var Movie = mongoose.model('Movie', movieSchema);

exports.Movie = Movie;
exports.validate = validateMovie;