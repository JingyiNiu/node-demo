const mongoose = require("mongoose");
const logger = require("../middleware/logger");

module.exports = () => {
    mongoose.set("strictQuery", false);
    mongoose
        .connect("mongodb://127.0.0.1:27017/vidly", {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        .then(() => {
            logger.log({
                level: "info",
                message: "Successfully connected to mongoDB...",
            });
        });
};
