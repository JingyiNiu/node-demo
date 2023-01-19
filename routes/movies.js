const express = require("express");
const router = express.Router();
const { Movie, validate } = require("../models/movie");
const { Genre } = require("../models/genre");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

router.get("/", async (req, res) => {
    const movies = await Movie.find().sort({ title: 1 });
    res.send(movies);
});

router.get("/:id", async (req, res) => {
    try {
        const movie = await Movie.findById({ _id: req.params.id });
        if (!movie) return res.status(404).send("The movie with given ID was not found.");
        res.send(movie);
    } catch (error) {
        res.send(error.message);
    }
});

router.post("/", auth, async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    try {
        const genre = await Genre.findById(req.body.genreId);
        if (!genre) return res.status(400).send("Invalid genre.");

        const movie = new Movie({
            title: req.body.title,
            genre: {
                _id: genre._id,
                name: genre.name,
            },
            numberInStock: req.body.numberInStock,
            dailyRentalRate: req.body.dailyRentalRate,
        });

        const result = await movie.save();
        res.send(result);
    } catch (error) {
        res.send(error.message);
    }
});

router.put("/:id", auth, async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    try {
        const genre = await Genre.findById(req.body.genreId);
        if (!genre) return res.status(400).send("Invalid genre.");

        const movie = await Movie.findByIdAndUpdate(
            { _id: req.params.id },
            {
                title: req.body.title,
                genre: {
                    _id: genre._id,
                    name: genre.name,
                },
                numberInStock: req.body.numberInStock,
                dailyRentalRate: req.body.dailyRentalRate,
            }
        );
        if (!movie) return res.status(404).send("The movie with given ID was not found.");

        const newMovie = await Movie.findById({ _id: req.params.id });
        res.send(newMovie);
    } catch (error) {
        return res.send(error.message);
    }
});

router.delete("/:id", [auth, admin], async (req, res) => {
    try {
        const movie = await Movie.findByIdAndRemove({ _id: req.params.id });
        if (!movie) return res.status(404).send("The movie with given ID was not found.");
        res.send("The record was deleted successfully");
    } catch (error) {
        res.send(error.message);
    }
});

module.exports = router;
