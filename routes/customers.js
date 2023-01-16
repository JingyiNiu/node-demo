const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Joi = require("joi");

const customersSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true,
        minLength: 2,
        maxLength: 255,
    },
    phone: {
        type: Number,
        require: true,
    },
    isGold: {
        type: Boolean,
    },
});

const Customer = mongoose.model("Customer", customersSchema);

router.get("/", async (req, res) => {
    const customers = await Customer.find().sort({ name: 1 });
    res.send(customers);
});

router.get("/:id", async (req, res) => {
    try {
        const customer = await Customer.findById({ _id: req.params.id });
        if (!customer) return res.status(404).send("The customer with given ID was not found.");
        res.send(customer);
    } catch (error) {
        res.send(error.message);
    }
});

router.post("/", async (req, res) => {
    const { error } = validateCustomer(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const customer = new Customer({
        name: req.body.name,
        phone: req.body.phone,
        isGold: req.body.isGold,
    });

    try {
        const result = await customer.save();
        res.send(result);
    } catch (error) {
        res.send(error.message);
    }
});

router.put("/:id", async (req, res) => {
    try {
        const customer = await Customer.findByIdAndUpdate(
            { _id: req.params.id },
            {
                $set: {
                    name: req.body.name,
                    phone: req.body.phone,
                    isGold: req.body.isGold,
                },
            }
        );
        if (!customer) return res.status(404).send("The customer with given ID was not found.");
        const newCustomer = await Customer.findById({ _id: req.params.id });
        res.send(newCustomer);
    } catch (error) {
        return res.send(error.message);
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const customer = await Customer.findByIdAndRemove({ _id: req.params.id });
        if (!customer) return res.status(404).send("The customer with given ID was not found.");
        res.send("The record was deleted successfully");
    } catch (error) {
        res.send(error.message);
    }
});

function validateCustomer(genre) {
    const schema = Joi.object({
        name: Joi.string().min(2).max(255).required(),
        phone: Joi.number().required(),
        isGold: Joi.boolean(),
    });

    return schema.validate(genre);
}

module.exports = router;
