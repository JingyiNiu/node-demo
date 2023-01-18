const dotenv = require("dotenv"); // Set environment variables
const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const debug = require("debug")("app:startup"); // Debug
const mongoose = require("mongoose");

const home = require("../routes/home");
const courses = require("../routes/courses");
const logger = require("../middleware/logger");

mongoose.set("strictQuery", false);
mongoose
    .connect("mongodb://127.0.0.1:27017/nodedemo")
    .then(() => {
        console.log("connected to mongoDB...");
    })
    .catch((error) => console.log("can not connect to mongoDB...", error));

dotenv.config();
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(helmet());
app.use(logger);
app.use("/api/", home);
app.use("/api/courses", courses);

// console.log("process.env.NODE_ENV: ", process.env.NODE_ENV)


if (process.env.NODE_ENV === "development") {
    app.use(morgan("tiny"));
    debug(`*** Morgan enabled on development env ***`);
}

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Listening on port ${port}...`);
});
