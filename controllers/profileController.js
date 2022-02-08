const User = require('../models/user')
const Profile = require('../models/profile')
const errorHandler = require('../utils/error-handler')
const {hashPassword, comparePassword} = require("../utils/bcrypt")
const {generateToken} = require("../utils/jwt")

module.exports = {
    register : async (req, res) => {
        const body = req.body
        try {
            const checkExist = await User.findOne({
                email : body.email
            });
            console.log(checkExist);
            if(checkExist) {
                return res.status(400).json({
                    status: "Bad Request",
                    message: "Email is Already Exist",
                });
            }
            const hashedPassword = hashPassword(body.password)
            const user = await User.create({...body, password: hashedPassword})
            const profile = await Profile.create({userId : user._id})
            const token = generateToken({
                id: user._id,
                email: user.email,
            });
            res.status(201).json({
                status: "OK",
                message: "Created",
                result: user,
                token: token,
                profile: profile
            })
        } catch (error) {
            errorHandler(res, error)
        }
    },
    editProfile : async (req, res) => {
        const body = req.body
        try {
            const profile = await Profile.create(body)
            res.status(201).json(profile)
        } catch (error) {
            errorHandler(res, error)
        }
    },
    getProfile : async (req, res) => {
        const user = req.user
    },
    changePassword : async (req, res) => {
        const body = req.body;
        const user = req.user //req.user from middleware
        try {
            //get data from database
            const users = await User.findOne({
                _id: user.id
            });
            const checkValid = comparePassword(oldPassword, users.password);
            if (!checkValid) {
                return res.status(400).json({
                    status: "Bad Request",
                    message: "Password is not valid",
                });
            }
            const hash = hashPassword(newPassword);
            //update to database
            const update = await User.update({
                password: hash,
            }, {
                where: {
                    id: user.id
                },
            });
            if (update[0] != 1) {
                return res.status(500).json({
                    status: "Internal Server Error",
                    message: "Update Password Failed"
                })
            }
            res.status(201).json({
                status: "OK",
                message: "Change Password Success"
            })
        } catch (error) {
            errorHandler(res, error);
        }
    }
}