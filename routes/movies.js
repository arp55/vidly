const express = require('express');
const router = express.Router();
const { Movie, validate } = require('../schema/movie');
const { Genre } = require('../schema/genre');
const auth = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
    const movies = await Movie.find();
    console.log(movies)
    res.send(movies);
})

router.post('/', auth, async (req, res) => {
    const { error } = validate(req.body);
    if (error) res.status(404).send(error.details[0].message);

    const genre = await Genre.findById(req.body.genreId);
    if (!genre) res.status(404).send("Invalid g");
    const movie = new Movie({
        title: req.body.title,
        genre: {
            _id: genre._id,
            name: genre.name
        },
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate
    })
    await movie.save();
    res.send(movie);
})

router.put('/:id', auth, async (req, res) => {
    const { error } = validate(req.body);
    if (error) res.status(404).send(error.details[0].message);

    const genre = await Genre.findById(req.body.genreId);
    if (!genre) res.status(404).send("Not found genre");

    const movie = await Movie.findByIdAndUpdate(req.params.id, {
        title: req.body.title,
        genre: {
            _id: genre.id,
            name: genre.name
        },
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate
    });
    if (!movie) res.status(404).send();

    await movie.save();
    res.send(movie)
})

router.delete('/', auth, async (req, res) => {
    const movie = await Movie.findByIdAndRemove(req.body.id);
    if (!movie) res.status(404).send("not found");

    res.send(movie);
})

router.get('/:id', auth, async (req, res) => {
    const movies = await Movie.find({ _id: req.params.id });
    console.log(movies)
    res.send(movies);
})

module.exports = router;