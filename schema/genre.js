var mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Joi = require('joi');

var genreSchema = new Schema({
    // _id: String,
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 20
    }
});

var Genre = mongoose.model('Genre', genreSchema);


function validateGenre(genre) {
    const schema = {
        name: Joi.string().min(5).max(20).required()
    };

    return Joi.validate(genre, schema);
}

exports.Genre = Genre;
exports.genreSchema = genreSchema;
exports.validateGenre = validateGenre;