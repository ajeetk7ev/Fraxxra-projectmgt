import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import config from './config/env.js';
import { ApiError } from './utils/ApiError.js';
import { errorHandler } from './middlewares/error.middleware.js';
import logger from './config/logger.js';

const app = express();

app.use(cors({
    origin: config.FRONTEND_URL,
    credentials: true
}));

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// Request logger middleware
app.use((req, res, next) => {
    logger.info(`${req.method} ${req.url}`);
    next();
});

// Routes import
import authRouter from './routes/auth.routes.js'
import projectRouter from './routes/project.routes.js'
import taskRouter from './routes/task.routes.js'

app.use("/health", (_, res) => {
  res.json({
    success: true,
    message: "Server is running",
  });
});

// Routes declaration
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/projects", projectRouter);
app.use("/api/v1/tasks", taskRouter);

// Centralized error handling middleware
app.use(errorHandler);

export { app };
