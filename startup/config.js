const dotenv = require("dotenv");
require("express-async-errors");

dotenv.config();
module.exports = () => {
    const privateKey = process.env.PRIVATE_KEY;
    if (!privateKey) {
        // console.error("FATAL ERROR: PRIVATE_KEY is not defined");
        // process.exit(1);
        throw new Error("FATAL ERROR: PRIVATE_KEY is not defined")
    }
};
