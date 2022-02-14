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
            if(checkExist) {
                return res.status(400).json({
                    status: "Bad Request",
                    message: "Email is Already Exist",
                });
            }
            const hashedPassword = await hashPassword(body.password)
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
        const user = req.user
        try {
            if(req.file){
                const updateProfile = await Profile.updateOne({userId : user.id}, {image: req.file.path, body})
                if(!updateProfile){
                    return res.status(500).json({
                        status: "Internal Server Error",
                        message: "Update User Profile is Failed"
                    })
                }
            } else {
                const updateProfile = await Profile.updateOne({userId : user.id}, body)
                if(!updateProfile){
                    return res.status(500).json({
                        status: "Internal Server Error",
                        message: "Update User Profile is Failed"
                    })
                }
            }
            const profile = await Profile.findOne({userId : user.id})
            res.status(201).json({
                status: "OK",
                message: "Update Success",
                result: profile
            })
        } catch (error) {
            errorHandler(res, error)
        }
    },
    getProfile : async (req, res) => {
        const user = req.user
        try {
            const profile = await Profile.findOne({userId : user.id})
            if(!profile) {
                return res.status(404).json({
                    status: "Not Found",
                    message: "Profile is not found",
                });
            }
            res.status(200).json({
                status: "OK",
                message: "Profile is found",
                result: profile
            })
        } catch (error) {
            errorHandler(res, error)
        }
    },
    changePassword : async (req, res) => {
        const {oldPassword, newPassword} = req.body;
        const user = req.user
        try {
            const users = await User.findOne({
                _id: user.id
            });
            const checkValid = await comparePassword(oldPassword, users.password);
            if (!checkValid) {
                return res.status(400).json({
                    status: "Bad Request",
                    message: "Password is not valid",
                });
            }
            const hash = hashPassword(newPassword);
            const update = await User.updateOne({_id : user.id}, {password: hash});
            if (!update) {
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
    },
    changeEmail : async (req, res) => {
        const body = req.body
        const user = req.user
        try {
            const update = await User.updateOne({_id: user.id}, {email: body.email})
            if (!update) {
                return res.status(500).json({
                    status: "Internal Server Error",
                    message: "Update Email Failed"
                })
            }
            const usernew = await User.findOne({_id: user.id})
            res.status(201).json({
                status: "OK",
                message: "Change Email Success",
                result: usernew.email
            })
        } catch (error) {
            errorHandler(res, error);
        }
    }
}