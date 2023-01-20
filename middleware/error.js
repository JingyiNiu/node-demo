const { transports, createLogger, format } = require("winston");

const logger = createLogger({
    format: format.combine(format.timestamp(), format.json()),
    transports: [new transports.File({ filename: "logs/logfile.log" })],
    exceptionHandlers: [new transports.File({ filename: "logs/exceptions.log" })],
});

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

module.exports.logger = logger;
