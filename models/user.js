const mongoose = require("mongoose");
const Joi = require("joi");
const passwordComplexity = require("joi-password-complexity");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const privateKey = process.env.PRIVATE_KEY;
if (!privateKey) {
    console.error("FATAL ERROR: PRIVATE_KEY is not defined");
    process.exit(1);
}

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        minLength: 2,
        maxLength: 255,
    },
    email: {
        type: String,
        unique: true,
        required: true,
        minLength: 5,
        maxLength: 255,
    },
    password: {
        type: String,
        required: true,
        minLength: 8,
        maxLength: 1024,
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
});

userSchema.methods.generateAuthToken = function () {
    const token = jwt.sign(
        {
            _id: this._id,
            isAdmin: this.isAdmin,
        },
        privateKey
    );
    return token;
};

const User = mongoose.model("User", userSchema);

const validateUser = (user) => {
    const schema = Joi.object({
        username: Joi.string().min(2).max(255).required(),
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(8).max(1024).required(),
        isAdmin:Joi.boolean()
    });
    return schema.validate(user);
};

const validatePasswordComplexity = (user) => {
    const label = "Password";
    const complexityOptions = {
        min: 8,
        max: 255,
        // lowerCase: 1,
        // upperCase: 1,
        // numeric: 1,
        // symbol: 1,
    };
    return passwordComplexity(complexityOptions, label).validate(user.password);
};

exports.User = User;
exports.validate = validateUser;
exports.validatePassword = validatePasswordComplexity;
