import { ApiError } from "../utils/ApiError.js";
import logger from "../config/logger.js";
import config from "../config/env.js";

const errorHandler = (err, req, res, next) => {
    let error = err;

    if (!(error instanceof ApiError)) {
        const statusCode =
            error.statusCode || (error.name === "ValidationError" ? 400 : 500);
        const message = error.message || "Something went wrong";
        error = new ApiError(statusCode, message, error?.errors || [], err.stack);
    }

    const response = {
        ...error,
        message: error.message,
        ...(config.NODE_ENV === "development" ? { stack: error.stack } : {}),
    };

    // Specific formatting for MongoDB/Mongoose errors if they weren't caught as ApiError
    if (err.name === "CastError") {
        response.message = `Resource not found. Invalid: ${err.path}`;
        response.statusCode = 400;
    }

    if (err.code === 11000) {
        const field = Object.keys(err.keyValue)[0];
        response.message = `Duplicate field value entered: ${field}`;
        response.statusCode = 400;
    }

    if (err.name === "JsonWebTokenError") {
        response.message = "Invalid token. Please log in again.";
        response.statusCode = 401;
    }

    if (err.name === "TokenExpiredError") {
        response.message = "Your token has expired. Please log in again.";
        response.statusCode = 401;
    }

    logger.error(`${req.method} ${req.url} - ${response.message}`, { stack: err.stack });

    return res.status(response.statusCode || 500).json({
        success: false,
        message: response.message,
        errors: response.errors || [],
        data: null,
        ...(config.NODE_ENV === "development" ? { stack: response.stack } : {}),
    });
};

export { errorHandler };
