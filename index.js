const dotenv = require("dotenv"); // Set environment variables
const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const debug = require("debug")("app:startup"); // Debug

const home = require("./routes/home");
const courses = require("./routes/courses");

dotenv.config();
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(helmet());
app.use("/api/", home);
app.use("/api/courses", courses);

// console.log("process.env.DEBUG: ", process.env.DEBUG)

if (process.env.NODE_ENV === "development") {
    app.use(morgan("tiny"));
    debug(`*** Morgan enabled on development env ***`);
}

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Listening on port ${port}...`);
});
