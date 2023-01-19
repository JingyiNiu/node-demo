const jwt = require("jsonwebtoken");

const admin = (req, res, next) => {
    if (!req.user.isAdmin) {
        return res.status(403).send("Access denied. You have no access.");
    }
    next();
};

module.exports = admin;
