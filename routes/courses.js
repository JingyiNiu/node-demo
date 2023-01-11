const express = require("express");
const router = express.Router();
const Joi = require("joi"); // Validate input

const courses = [
    { id: 1, name: "course1" },
    { id: 2, name: "course2" },
    { id: 3, name: "course3" },
];

router.get("/", function (req, res) {
    res.send(courses);
});

router.get("/:id", function (req, res) {
    const course = courses.find((course) => course.id === parseInt(req.params.id));
    if (!course) {
        return res.status(404).send(`The courses with given ID was not found`);
    }
    res.send(course);
});

router.post("/", function (req, res) {
    const { error } = validateCourse(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    const data = {
        id: courses.length + 1,
        name: req.body.name,
    };
    courses.push(data);
    res.send(data);
});

router.put("/:id", function (req, res) {
    const course = courses.find((course) => course.id === parseInt(req.params.id));
    if (!course) {
        return res.status(404).send(`The courses with given ID was not found`);
    }

    const { error } = validateCourse(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }
    course.name = req.body.name;
    res.send(course);
});

router.delete("/api/course/:id", function (req, res) {
    const course = courses.find((course) => course.id === parseInt(req.params.id));
    if (!course) {
        return res.status(404).send(`The courses with given ID was not found`);
    }

    const index = courses.indexOf(course);
    courses.splice(index, 1);

    res.send("Delete successfully");
});

const validateCourse = (course) => {
    const schema = Joi.object({
        name: Joi.string().min(3).required(),
    });

    const result = schema.validate(course);
    return result;
};

module.exports = router;
