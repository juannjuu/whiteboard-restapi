const jwt = require("jsonwebtoken");

module.exports = {
    generateToken: (payload) => {
        const token = jwt.sign(payload, (JWT_SECRET = "ngapainwoy"));
        return token;
    },
    verifyToken: (token) => {
        const verify = jwt.verify(token, (JWT_SECRET = "ngapainwoy"));
        return verify;
    },
};