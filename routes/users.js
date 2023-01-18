const express = require("express");
const router = express.Router();
const _ = require("lodash");
const bcrypt = require("bcrypt");
const { User, validate, validatePassword } = require("../models/user");

router.get("/", async (req, res) => {
    const users = await User.find();
    res.send(users);
});

router.post("/", async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const pwdCheck = validatePassword(req.body);
    if (pwdCheck.error) return res.status(400).send(pwdCheck);

    try {
        const userExist = await User.findOne({ email: req.body.email });
        if (userExist) return res.status(400).send("Email already exists");

        const user = new User(_.pick(req.body, ["username", "email", "password"]));
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);

        const result = await user.save();

        const token = user.generateAuthToken()

        const header = { "x-auth-token": token };
        const data = _.pick(result, ["_id", "username", "email"]);
        res.header(header).send(data);
    } catch (error) {
        res.send(error.message);
    }
});

module.exports = router;
