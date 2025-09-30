import e from "express";
import { register } from "../controller/authController.js";
import { inputValidationMiddleware } from "../middleware/inputValidationMiddleware.js";
import { registerSchema } from "../validation/registerSchema.js";

const router = e.Router();

router.post("/register", inputValidationMiddleware(registerSchema), register);

export const authRouter = router;
