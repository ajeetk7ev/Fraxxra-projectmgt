import Joi from "joi";

const addTaskSchema = Joi.object({
    title: Joi.string().required().trim().min(3).max(100).messages({
        "string.empty": "Title is required",
        "string.min": "Title must be at least 3 characters long",
        "string.max": "Title cannot exceed 100 characters",
        "any.required": "Title is required"
    }),
    description: Joi.string().required().trim().min(5).max(1000).messages({
        "string.empty": "Description is required",
        "string.min": "Description must be at least 5 characters long",
        "string.max": "Description cannot exceed 1000 characters",
        "any.required": "Description is required"
    }),
    status: Joi.string().valid("todo", "in-progress", "completed").default("todo").messages({
        "any.only": "Status must be either: todo, in-progress, or completed"
    }),
    priority: Joi.string().valid("low", "medium", "high").default("medium").messages({
        "any.only": "Priority must be either: low, medium, or high"
    }),
    dueDate: Joi.date().required().messages({
        "date.base": "Please provide a valid due date",
        "any.required": "Due date is required"
    }),
});

const updateTaskSchema = Joi.object({
    title: Joi.string().trim().min(3).max(100).messages({
        "string.min": "Title must be at least 3 characters long",
        "string.max": "Title cannot exceed 100 characters",
    }),
    description: Joi.string().trim().min(5).max(1000).messages({
        "string.min": "Description must be at least 5 characters long",
        "string.max": "Description cannot exceed 1000 characters",
    }),
    status: Joi.string().valid("todo", "in-progress", "completed").messages({
        "any.only": "Status must be either: todo, in-progress, or completed"
    }),
    priority: Joi.string().valid("low", "medium", "high").messages({
        "any.only": "Priority must be either: low, medium, or high"
    }),
    dueDate: Joi.date().messages({
        "date.base": "Please provide a valid due date"
    }),
}).min(1).messages({
    "object.min": "Provide at least one field to update"
});

export {
    addTaskSchema,
    updateTaskSchema
};
