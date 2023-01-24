const { transports, createLogger, format } = require("winston");
const logger = require("../middleware/logger");

module.exports = function (error, req, res, next) {
    logger.log({
        level: "error",
        message: error.message,
    });

    res.status(500).send({
        error: "Something failed",
        message: error.message,
    });
};
