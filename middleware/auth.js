const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const privateKey = process.env.PRIVATE_KEY;

const auth = (req, res, next) => {
    const token = req.header("x-auth-token");
    if (!token) {
        return res.status(401).send("Access denied. No token provided");
    }
    try {
        const decoded = jwt.verify(token, privateKey);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(400).send("Invalid token.");
    }
};

module.exports = auth;
