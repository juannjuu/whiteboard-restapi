const errorHandler = require('../utils/error-handler')
const jwt = require('jsonwebtoken')
const User = require('../models/user')

module.exports = {
    isLogin: async (req, res, next) => {
        try {
            let token = req.header("Authorization")
            if (!token) {
                return res.status(401).json({
                    message: "No token detected",
                    status: "Unauthorized",
                    result: {}
                })
            }
            //flush token
            token = token.replace("Bearer ", "")
            const decoded = jwt.verify(token, process.env.JWT_KEY, {
                expiresIn: "12 hours"
            })
            if (!decoded) {
                return res.status(401).json({
                    message: "Token is not valid",
                    status: "Unauthorized",
                    result: {}
                })
            }
            const user = await User.findOne({_id : decoded.id});
            if (!user) {
                return res.status(401).json({
                    message: "User is not found",
                    status: "Unauthorized",
                    result: {}
                })
            }
            req.user = {
                id: user._id,
                email: user.email,
            }
            next()
        } catch (error) {
            errorHandler(res, error)
        }
    }
}