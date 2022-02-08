const Joi = require('joi');

module.exports = (req, res, next) => {
    profileValidation : (req, res, next) => {
        const schema = Joi.object({
            name : Joi.string().required(),
            email : Joi.string().email().required(),
            password : Joi.string().min(8).required()
        })
        const {error} = schema.validate(req.body)
        if (error) {
            return res.status(400).json({
              status: "Bad Request",
              message: error.message,
            });
        }
        next()
    }
}