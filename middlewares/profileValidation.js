const Joi = require('joi')

module.exports = {
    editProfileValidation : (req, res, next) => {
        const schema = Joi.object({
            image: Joi.string(),
            companyName: Joi.string(),
            industry: Joi.string(),
            role: Joi.string(),
        })
        const {error} = schema.validate(req.body)
        if (error) {
            return res.status(400).json({
              status: "Bad Request",
              message: error.message,
            });
        }  
        next();
    },
    changeEmailValidation : (req, res, next) => {
        const schema = Joi.object({
            email: Joi.string().email().required(),
        })
        const {error} = schema.validate(req.body)
        if (error) {
            return res.status(400).json({
              status: "Bad Request",
              message: error.message,
            });
        }  
        next();
    }
}