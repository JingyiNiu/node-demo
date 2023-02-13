const express = require("express");
const router = express.Router();
const { Genre, validate } = require("../models/genre");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const validateObjectId = require("../middleware/validateObjectId");

router.get("/", async (req, res, next) => {
    const genres = await Genre.find().sort({ name: 1 });
    res.send(genres);
});

router.get("/:id", validateObjectId, async (req, res) => {
    const genre = await Genre.findById({ _id: req.params.id });
    if (!genre) return res.status(404).send("The genre with given ID was not found.");
    res.send(genre);
});

router.post("/", auth, async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const genre = new Genre({
        name: req.body.name,
    });

    const result = await genre.save();
    res.send(result);
});

router.put("/:id", auth, async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

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
});

router.delete("/:id", [auth, admin], async (req, res) => {
    const genre = await Genre.findByIdAndRemove({ _id: req.params.id });
    if (!genre) return res.status(404).send("The genre with given ID was not found.");

    res.send("The record was deleted successfully");
});

module.exports = router;
