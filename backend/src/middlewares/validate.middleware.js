import { ApiError } from "../utils/ApiError.js";

const validate = (schema) => (req, res, next) => {
    const { value, error } = schema.validate(req.body, {
        abortEarly: false, // Return all errors, not just the first one
        stripUnknown: true, // Remove unknown fields from the body
    });

    if (error) {
        const formattedErrors = {};
        error.details.forEach((detail) => {
            const field = detail.path[0];
            if (!formattedErrors[field]) {
                formattedErrors[field] = [];
            }
            formattedErrors[field].push(detail.message);
        });
        throw new ApiError(400, "Validation Error", formattedErrors);
    }

    req.body = value; // Replace body with the validated/stripped value
    next();
};

export default validate;
