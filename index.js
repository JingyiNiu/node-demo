require("express-async-errors");
const winston = require("winston");
require("winston-mongodb");
const dotenv = require("dotenv");
const express = require("express");
const mongoose = require("mongoose");
const routes = require("./startup/routes");

const app = express();
routes(app);

const logger = winston.createLogger({
    format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
    transports: [new winston.transports.File({ filename: "logs/logfile.log" })],
    exceptionHandlers: [new winston.transports.File({ filename: "logs/exceptions.log" })],
});

winston.add(
    new winston.transports.MongoDB({
        db: "mongodb://127.0.0.1:27017/vidly",
        options: { useUnifiedTopology: true },
    })
);

process.on("uncaughtException", (error) => {
    logger.error({ message: "Uncaught exception detected... " + error });
    process.exit(1);
});

process.on("unhandledRejection", (error) => {
    logger.error({ message: "unhandled rejection detected... " + error });
    process.exit(1);
});

// throw new Error("*** Something failed: uncaughtException ***");
// const promiseError = Promise.reject(new Error("*** Something failed: unhandledRejection ***"));
// promiseError.then(() => console.log("Done"));

const privateKey = process.env.PRIVATE_KEY;
if (!privateKey) {
    console.error("FATAL ERROR: PRIVATE_KEY is not defined");
    process.exit(1);
}

mongoose.set("strictQuery", false);
mongoose
    .connect("mongodb://127.0.0.1:27017/vidly", { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("Successfully connected to mongoDB...");
    })
    .catch((error) => console.log("Can not connect to mongoDB...", error));

dotenv.config();

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Listening on port ${port}...`);
});
