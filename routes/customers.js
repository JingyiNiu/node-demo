const express = require("express");
const router = express.Router();
const {Customer, validate} = require("../models/customer")

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
    const { error } = validate(req.body);
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
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

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

module.exports = router;