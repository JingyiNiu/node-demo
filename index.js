const dotenv = require("dotenv");
const config = require("config")
const Joi = require("joi");
const express = require("express");
const helmet = require("helmet");
const morgan = require('morgan')

dotenv.config()
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(helmet());


if(process.env.NODE_ENV === 'development'){
    app.use(morgan('tiny'));
    console.log(`*** Morgan enabled on development env ***`)
}

const courses = [
    { id: 1, name: "course1" },
    { id: 2, name: "course2" },
    { id: 3, name: "course3" },
];
app.get("/", function (req, res) {
    res.send("Hello World...");
});

app.get("/api/courses", function (req, res) {
    res.send(courses);
});

app.get("/api/course/:id", function (req, res) {
    const course = courses.find((course) => course.id === parseInt(req.params.id));
    if (!course) {
        return res.status(404).send(`The courses with given ID was not found`);
    }
    res.send(course);
});

app.post("/api/courses", function (req, res) {
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

app.put("/api/course/:id", function (req, res) {
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

app.delete("/api/course/:id", function (req, res) {
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

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Listening on port ${port}...`);
});
