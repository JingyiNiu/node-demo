const express = require("express");
const { model } = require("mongoose");
const router = express.Router();
const asyncMiddleware = require("../middleware/async");

router.get("/", asyncMiddleware(function (req, res) {
    res.send("home");
}));

module.exports = router;
