const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const { Movie } = require('../schema/movie');
const { validate, Rental } = require('../schema/rental');
const { Customer } = require('../schema/customer');
const Fawn = require('fawn');
const auth = require('../middleware/auth');

Fawn.init(mongoose);

router.get('/', auth, async (req, res) => {
    const rental = await Rental.find().sort('-dateTaken');
    if (!movies) res.status(404).send("Not found any movie");
    res.send(movies);
})

router.post('/', auth, async (req, res) => {
    const { error } = validate(req.body);
    if (error) res.status(404).send(error.details[0].message);

    const customer = await Customer.findById(req.body.customerId);
    if (!customer) res.status(404).send('Customer not found');

    const movie = await Movie.findById(req.body.movieId);
    if (!movie) res.status(404).send("Movie not found");

    if (movie.numberInStock === 0) return res.status(404).send("Not in stock");

    let rental = new Rental({
        customer: {
            _id: customer._id,
            name: customer.name,
            phone: customer.phone
        },
        movie: {
            _id: movie._id,
            title: movie.title,
            dailyRentalRate: movie.dailyRentalRate
        }
    })
    try {
        new Fawn.Task()
            .save('rentals', rental)
            .update('movies', { _id: movie._id }, {
                $inc: { numberInStock: -1 }
            })
            .run();
        res.send(rental);
    }
    catch (err) {
        res.status(500).send("some shit happened")
    }
})

module.exports = router;