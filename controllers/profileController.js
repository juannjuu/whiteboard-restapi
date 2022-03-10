const User = require('../models/user')
const Profile = require('../models/profile')
const errorHandler = require('../utils/error-handler')
const bcrypt = require("bcrypt")

module.exports = {
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
            const profile = await Profile.findOne({userId : user.id}).populate({
                path: "userId",
                select: ["name", "email"]
            })
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
            const checkValid = await bcrypt.compare(oldPassword, users.password);
            if (!checkValid) {
                return res.status(400).json({
                    status: "Bad Request",
                    message: "Password is not valid",
                });
            }
            const hash = await bcrypt.hash(newPassword, 10);
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
    }
}