const Joi = require("joi");
const jwt = require("jsonwebtoken");
const Users = require("../models/user");
const Profile = require("../models/profile");
const PasswordReset = require("../models/passwordreset");
const bcrypt = require("bcrypt");
const errorHandler = require("../utils/error-handler");
const random = require("randomstring");
const sendMail = require("../utils/mail-sender");

module.exports = {
    register: async(req, res) => {
        const body = req.body;
        try {
            const check = await Users.findOne({
                email: body.email,
            });
            if (check) {
                return res.status(400).json({
                    status: "Bad Request",
                    message: "Email already exist, please register with different email or login",
                    result: {},
                });
            }
            const hashedPassword = await bcrypt.hash(body.password, 10);
            const user = await Users.create({
                name: body.name,
                email: body.email,
                password: hashedPassword,
            });
            const profile = await Profile.create({ userId: user._id });
            const token = jwt.sign({
                    id: user._id,
                    email: user.email,
                },
                process.env.JWT_KEY, { expiresIn: 60 * 60 * 12 }
            );
            res.status(201).json({
                status: "Created",
                message: "Registered successfuly",
                result: user,
                token: token,
                profile: profile,
            });
        } catch (error) {
            errorHandler(res, error);
        }
    },
    login: async(req, res) => {
        const { email, password } = req.body;
        try {
            const user = await Users.findOne({
                email: email,
            });
            if (!user) {
                return res.status(401).json({
                    status: "Unauthorized",
                    message: "Invalid email or password",
                    result: {},
                });
            }
            const isValid = await bcrypt.compare(password, user.password);
            if (!isValid) {
                return res.status(401).json({
                    status: "Unauthorized",
                    message: "Invalid email or password",
                    result: {},
                });
            }
            const token = jwt.sign({ email: user.email, id: user.id },
                process.env.JWT_KEY, {
                    expiresIn: "12h",
                }
            );

            res.status(200).json({
                status: "OK",
                message: "Logged in successfuly",
                result: {
                    token,
                },
            });
        } catch (error) {
            errorHandler(res, error);
        }
    },
    forgotPassword: async(req, res) => {
        const { email } = req.body;
        try {
            const user = await Users.findOne({ email: email });
            if (!user) {
                return res.status(404).json({
                    status: "Not Found",
                    message: "Invalid email, user with that email is not found",
                    result: {},
                });
            }
            const passwordReset = await PasswordReset.create({
                email,
                validationCode: random.generate(50),
                isDone: false,
            });
            sendMail(
                email,
                "Password Reset",
                ` <h1> password reset confirmation</h1>
                <b> please confirm your reset password</b>
                <hr>
                <a href="https://whiteboard-product.herokuapp.com/api/v1/auth/forgot?code=${passwordReset.validationCode}"a>click here</a>`
            );

            res.status(200).json({
                status: "success",
                message: "We've sent you an email to confirm your password reset",
                result: {},
            });
        } catch (error) {
            errorHandler(res, error);
        }
    },
    resetPassword: async(req, res) => {
        const { validationCode, password } = req.body;
        try {
            const schema = Joi.object({
                password: Joi.string().min(6).required(),
                validationCode: Joi.string().required,
            });
            const { error } = schema.validate();
            if (error) {
                return res.status(400).json({
                    status: "Bad Request",
                    message: error.message,
                    result: {},
                });
            }
            const validate = await PasswordReset.findOne({
                validationCode,
                isDone: false,
            });
            if (!validate) {
                return res.status(404).json({
                    status: "Not Found",
                    message: "Invalid validation code confirmation",
                    result: {},
                });
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            await Users.updateOne({ email: validate.email }, { password: hashedPassword });
            await PasswordReset.updateOne({ isDone: true }, { validationCode: validationCode });

            res.status(200).json({
                status: "success",
                message: "Successfuly change the password",
                result: {},
            });
        } catch (error) {
            errorHandler(res, error);
        }
    },
    googleCallback: async(req, res) => {
        const profile = req.user;
        console.log(req.user)
        let user;
        try {
            console.log(profile);
            const token = jwt.sign({ email: profile.email, id: profile._id },
                process.env.JWT_KEY
            );
            res.cookie("token", token);
            res.redirect("/?token=" + token);
        } catch (error) {
            console.log(error);
            res.status(500).send("Internal Server Error");
        }
    },
};