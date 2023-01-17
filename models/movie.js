const mongoose = require("mongoose");
const Joi = require("joi");
const { genreSchema } = require("./genre");

const movieSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        minLength: 2,
        maxLength: 255,
    },
    genre: {
        type: genreSchema,
        required: true,
    },
    numberInStock: {
        type: Number,
        default: 0,
        min: 0,
        max: 255,
    },
    dailyRentalRate: {
        type: Number,
        default: 0,
        min: 0,
        max: 255,
    },
});

const Movie = mongoose.model("Movie", movieSchema);

const validateMovie = (movie) => {
    const schema = Joi.object({
        title: Joi.string().min(2).max(255).required(),
        genreId: Joi.string().required(),
        numberInStock: Joi.number(),
        dailyRentalRate: Joi.number(),
    });
    return schema.validate(movie);
};

exports.Movie = Movie;
exports.validate = validateMovie;
