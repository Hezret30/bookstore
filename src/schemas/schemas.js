const Joi = require('joi')

const signUp = Joi.object({

		username: Joi.string().min(3).max(30).required(),
        phone: Joi.number().greater(60000000).max(65999999).required(),
        email: Joi.string().email().required(),
        city: Joi.string().min(4).max(20).required(),
        password: Joi.string().min(6).max(12).required()
					
}).options({ abortEarly: false });


module.exports = {
    signUp
}