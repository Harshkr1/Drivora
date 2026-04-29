const { body } = require("express-validator");
const db = require("./../db/query");

const customValidator = [
    body("username").custom(async value => {
        if (await db.doesUsernameExist(value)) {
            throw new Error("Username already taken");
        }
    }),
    body('password')
        .isLength({ min: 5 })
        .withMessage("Password must be at least 5 characters long").bail()
        .matches(/[!@#$%^&*(),.?":{}|<>]/)
        .withMessage('Password must contain at least one special character').bail(),
    body('confirmPassword').custom((value, { req }) => {
        if (value != req.body.password) {
            throw new Error("Password and confirm password does not matches");
        }
        return true;
    })
];

module.exports = { customValidator }