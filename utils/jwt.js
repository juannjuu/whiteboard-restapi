const jwt = require('jsonwebtoken')

module.exports = {
    generateToken: (payload) => {
        const token = jwt.sign(payload, process.env.JWT_KEY, {
            expiresIn: 60 * 60 * 12
        })
        return token;
    },
    verifyToken: (token) => {
        const verify = jwt.verify(token, process.env.JWT_KEY, {
            expiresIn: "12 hours"
        })
        return verify
    }
}