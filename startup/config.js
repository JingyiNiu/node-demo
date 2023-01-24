const dotenv = require("dotenv");
require("express-async-errors"); // replace try-catch

dotenv.config();
module.exports = () => {
    const privateKey = process.env.PRIVATE_KEY;
    if (!privateKey) {
        throw new Error("FATAL ERROR: PRIVATE_KEY is not defined");
    }
};
