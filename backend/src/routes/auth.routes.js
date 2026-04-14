import { Router } from "express";
import AuthController from "../controllers/Auth.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import validate from "../middlewares/validate.middleware.js";
import { registerSchema, loginSchema } from "../validators/auth.validator.js";

const router = Router();

router.route("/register").post(validate(registerSchema), AuthController.register);
router.route("/login").post(validate(loginSchema), AuthController.login);
router.route("/logout").post(verifyJWT, AuthController.logout);
router.route("/me").get(verifyJWT, AuthController.getCurrentUser);

export default router;
