import { Router } from "express";
import ProjectController from "../controllers/Project.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import validate from "../middlewares/validate.middleware.js";
import { createProjectSchema, updateProjectSchema } from "../validators/project.validator.js";

const router = Router();

router.use(verifyJWT); // Secure all project routes

router.route("/")
    .post(validate(createProjectSchema), ProjectController.createProject)
    .get(ProjectController.getAllProjects);

router.route("/:projectId")
    .get(ProjectController.getProjectById)
    .patch(validate(updateProjectSchema), ProjectController.updateProject)
    .delete(ProjectController.deleteProject);

export default router;
