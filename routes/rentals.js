const express = require("express");
const router = express.Router();
const { Rental, validate } = require("../models/rental");
const { Customer } = require("../models/customer");
const { Movie } = require("../models/movie");
const auth = require("../middleware/auth");

router.get("/", async (req, res) => {
    const rentals = await Rental.find().sort({ dateOut: -1 });
    res.send(rentals);
});

router.get("/:id", async (req, res) => {
    try {
        const rental = await Rental.findById({ _id: req.params.id });
        if (!rental) return res.status(404).send("The rental with given ID was not found.");
        res.send(rental);
    } catch (error) {
        res.send(error.message);
    }
});

router.post("/", auth, async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    try {
        const customer = await Customer.findById(req.body.customerId);
        if (!customer) return res.status(400).send("Invalid customer ID.");

        const movie = await Movie.findById(req.body.movieId);
        if (!movie) return res.status(400).send("Invalid movie ID.");

        const rental = new Rental({
            customer: {
                _id: customer._id,
                name: customer.name,
                phone: customer.phone,
            },
            movie: {
                _id: movie._id,
                title: movie.title,
                dailyRentalRate: movie.dailyRentalRate,
            },
        });

        const result = await rental.save();
        movie.numberInStock--;
        movie.save();

        res.send(result);
    } catch (error) {
        res.send(error.message);
    }
});

module.exports = router;
