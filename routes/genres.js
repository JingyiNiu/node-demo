const express = require("express");
const router = express.Router();
const { Genre, validate } = require("../models/genre");

router.get("/", async (req, res) => {
    const genres = await Genre.find().sort({ name: 1 });
    res.send(genres);
});

router.get("/:id", async (req, res) => {
    try {
        const genre = await Genre.findById({ _id: req.params.id });
        if (!genre) return res.status(404).send("The genre with given ID was not found.");
        res.send(genre);
    } catch (error) {
        res.send(error.message);
    }
});

router.post("/", async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const genre = new Genre({
        name: req.body.name,
    });

    try {
        const result = await genre.save();
        res.send(result);
    } catch (error) {
        res.send(error.message);
    }
});

router.put("/:id", async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    try {
        const genre = await Genre.findByIdAndUpdate(
            { _id: req.params.id },
            {
                $set: {
                    name: req.body.name,
                },
            }
        );
        if (!genre) return res.status(404).send("The genre with given ID was not found.");

        const newGenre = await Genre.findById({ _id: req.params.id });
        res.send(newGenre);
    } catch (error) {
        return res.send(error.message);
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const genre = await Genre.findByIdAndRemove({ _id: req.params.id });
        if (!genre) return res.status(404).send("The genre with given ID was not found.");
        
        res.send("The record was deleted successfully");
    } catch (error) {
        res.send(error.message);
    }
});

module.exports = router;