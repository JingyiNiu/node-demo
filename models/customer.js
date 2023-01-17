const mongoose = require("mongoose");
const Joi = require("joi");

const customerSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true,
        minLength: 2,
        maxLength: 255,
    },
    phone: {
        type: String,
        require: true,
        minLength: 4,
        maxLength: 20,
        match: /^[0-9]*$/,
    },
    isGold: {
        type: Boolean,
        default: false,
    },
});

const Customer = mongoose.model("Customer", customerSchema);

function validateCustomer(genre) {
    const schema = Joi.object({
        name: Joi.string().min(2).max(255).required(),
        phone: Joi.number().required(),
        isGold: Joi.boolean(),
    });

    return schema.validate(genre);
}

module.exports.Customer = Customer
module.exports.validate = validateCustomer
