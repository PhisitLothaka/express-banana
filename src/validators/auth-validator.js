const Joi = require("joi");

const loginSchema = Joi.object({
  email: Joi.string().required(),
  password: Joi.string().required(),
});

exports.loginSchema = loginSchema;

const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string()
    .pattern(/^[a-z,A-Z,0-9]{6,30}$/)
    .trim()
    .required(),
  confirmPassword: Joi.string()
    .valid(Joi.ref("password"))
    .trim()
    .required()
    .strip(),
  firstName: Joi.string().trim().required(),
  lastName: Joi.string().trim().required(),
});
exports.registerSchema = registerSchema;
