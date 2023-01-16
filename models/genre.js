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

function validateGenre(genre) {
    const schema = Joi.object({
        name: Joi.string().min(3).required(),
    });

    return schema.validate(genre);
}

exports.Genre = Genre;
exports.validate = validateGenre;
