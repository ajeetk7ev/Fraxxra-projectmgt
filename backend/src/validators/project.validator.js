import Joi from "joi";

const createProjectSchema = Joi.object({
    projectName: Joi.string().required().trim().min(3).max(100).messages({
        "string.empty": "Project name is required",
        "string.min": "Project name must be at least 3 characters long",
        "string.max": "Project name cannot exceed 100 characters",
        "any.required": "Project name is required"
    }),
    description: Joi.string().required().trim().min(5).max(500).messages({
        "string.empty": "Description is required",
        "string.min": "Description must be at least 5 characters long",
        "string.max": "Description cannot exceed 500 characters",
        "any.required": "Description is required"
    }),
});

const updateProjectSchema = Joi.object({
    projectName: Joi.string().trim().min(3).max(100).messages({
        "string.min": "Project name must be at least 3 characters long",
        "string.max": "Project name cannot exceed 100 characters",
    }),
    description: Joi.string().trim().min(5).max(500).messages({
        "string.min": "Description must be at least 5 characters long",
        "string.max": "Description cannot exceed 500 characters",
    }),
}).min(1).messages({
    "object.min": "Provide at least one field to update"
});

export {
    createProjectSchema,
    updateProjectSchema
};
