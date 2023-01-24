const logger = require("../middleware/logger");
const mongoose = require("mongoose");

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
            console.log("Successfully connected to mongoDB...")
        })
};
