require("express-async-errors");
const winston = require("winston");
require("winston-mongodb");
const dotenv = require("dotenv");
const express = require("express");
const app = express();
require("./startup/routes")(app);
require("./startup/db")();
const logger = require("./middleware/logger");

winston.add(
    new winston.transports.MongoDB({
        db: "mongodb://127.0.0.1:27017/vidly",
        options: { useUnifiedTopology: true },
    })
);

process.on("uncaughtException", (error) => {
    logger.log({
        level: "error",
        message: "Uncaught exception detected... " + error,
    });
    process.exit(1);
});

process.on("unhandledRejection", (error) => {
    logger.log({
        level: "error",
        message: "Unhandled rejection detected... " + error,
    });
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

dotenv.config();

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Listening on port ${port}...`);
});
