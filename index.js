const dotenv = require("dotenv");
const express = require("express");
const mongoose = require("mongoose");
const genres = require("./routes/genres");
const customers = require("./routes/customers");
const movies = require("./routes/movies");
const rentals = require("./routes/rentals");

mongoose.set("strictQuery", false);
mongoose
    .connect("mongodb://127.0.0.1:27017/vidly")
    .then(() => {
        console.log("Successfully connected to mongoDB...");
    })
    .catch((error) => console.log("Can not connect to mongoDB...", error));

dotenv.config();

const app = express();
app.use(express.json());
app.use("/api/genres", genres);
app.use("/api/customers", customers);
app.use("/api/movies", movies);
app.use("/api/rentals", rentals);

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Listening on port ${port}...`);
});
