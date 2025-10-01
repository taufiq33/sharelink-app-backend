import e from "express";
import { register, login } from "../controller/authController.js";
import { inputValidationMiddleware } from "../middleware/inputValidationMiddleware.js";
import { registerSchema } from "../validation/registerSchema.js";
import { loginSchema } from "../validation/loginSchema.js";

const router = e.Router();

router.post("/register", inputValidationMiddleware(registerSchema), register);
router.post("/login", inputValidationMiddleware(loginSchema), login);

export const authRouter = router;
