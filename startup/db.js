const mongoose = require("mongoose");
const logger = require("../middleware/logger");

module.exports = () => {
    mongoose.set("strictQuery", false);
    const currentDB = process.env.NODE_ENV === "test" ? process.env.DB_TEST : process.env.DB;
    mongoose
        .connect(`${currentDB}`, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        .then(() => {
            logger.log({
                level: "info",
                message: `Successfully connected to ${currentDB}...`,
            });
        });
};
