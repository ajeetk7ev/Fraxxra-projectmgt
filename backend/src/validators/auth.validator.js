import Joi from "joi";

const registerSchema = Joi.object({
    name: Joi.string().required().trim().min(2).max(50).messages({
        "string.empty": "Name is required",
        "string.min": "Name must be at least 2 characters long",
        "string.max": "Name cannot exceed 50 characters",
        "any.required": "Name is required"
    }),
    email: Joi.string().required().trim().email().lowercase().messages({
        "string.empty": "Email is required",
        "string.email": "Please provide a valid email address",
        "any.required": "Email is required"
    }),
    password: Joi.string().required().min(6).messages({
        "string.empty": "Password is required",
        "string.min": "Password must be at least 6 characters long",
        "any.required": "Password is required"
    }),
});

const loginSchema = Joi.object({
    email: Joi.string().required().trim().email().lowercase().messages({
        "string.empty": "Email is required",
        "string.email": "Please provide a valid email address",
        "any.required": "Email is required"
    }),
    password: Joi.string().required().messages({
        "string.empty": "Password is required",
        "any.required": "Password is required"
    }),
});

export {
    registerSchema,
    loginSchema
};
