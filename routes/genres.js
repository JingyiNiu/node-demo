const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Joi = require("joi");

const genresSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true,
        minLength: 5,
        maxLength: 255,
    },
});

const Genre = mongoose.model("Genre", genresSchema);

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
    const { error } = validateGenre(req.body);
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
    const { error } = validateGenre(req.body);
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
        const newGenre = await Genre.findById({ _id: req.params.id });
        res.send(newGenre);
        if (!genre) return res.status(404).send("The genre with given ID was not found.");
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

function validateGenre(genre) {
    const schema = Joi.object({
        name: Joi.string().min(3).required(),
    });

    return schema.validate(genre);
}

module.exports = router;
