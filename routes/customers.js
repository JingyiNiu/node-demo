const express = require("express");
const router = express.Router();
const { Customer, validate } = require("../models/customer");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const asyncMiddleware = require("../middleware/async");

router.get(
    "/",
    asyncMiddleware(async (req, res) => {
        const customers = await Customer.find().sort({ name: 1 });
        res.send(customers);
    })
);

router.get(
    "/:id",
    asyncMiddleware(async (req, res) => {
        const customer = await Customer.findById({ _id: req.params.id });
        if (!customer) return res.status(404).send("The customer with given ID was not found.");
        res.send(customer);
    })
);

router.post(
    "/",
    auth,
    asyncMiddleware(async (req, res) => {
        const { error } = validate(req.body);
        if (error) return res.status(400).send(error.details[0].message);

        const customer = new Customer({
            name: req.body.name,
            phone: req.body.phone,
            isGold: req.body.isGold,
        });

        const result = await customer.save();
        res.send(result);
    })
);

router.put(
    "/:id",
    auth,
    asyncMiddleware(async (req, res) => {
        const { error } = validate(req.body);
        if (error) return res.status(400).send(error.details[0].message);

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
    })
);

router.delete(
    "/:id",
    [auth, admin],
    asyncMiddleware(async (req, res) => {
        const customer = await Customer.findByIdAndRemove({ _id: req.params.id });
        if (!customer) return res.status(404).send("The customer with given ID was not found.");
        res.send("The record was deleted successfully");
    })
);

module.exports = router;
