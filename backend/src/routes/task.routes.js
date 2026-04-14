import { Router } from "express";
import TaskController from "../controllers/Task.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import validate from "../middlewares/validate.middleware.js";
import { addTaskSchema, updateTaskSchema } from "../validators/task.validator.js";

const router = Router();

router.use(verifyJWT); // Secure all task routes

router.route("/project/:projectId")
    .post(validate(addTaskSchema), TaskController.addTask)
    .get(TaskController.getProjectTasks);

router.route("/:taskId")
    .patch(validate(updateTaskSchema), TaskController.updateTask)
    .delete(TaskController.deleteTask);

export default router;
