require("winston-mongodb");
const winston = require("winston");
const logger = require("../middleware/logger");

module.exports = () => {
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
    
    // Manually create some errors
    // throw new Error("*** Something failed: uncaughtException ***");
    // const promiseError = Promise.reject(new Error("*** Something failed: unhandledRejection ***"));
    // promiseError.then(() => console.log("Done"));
}

