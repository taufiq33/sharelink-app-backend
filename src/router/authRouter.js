import e from "express";
import { register, login, logout } from "../controller/authController.js";
import { inputValidationMiddleware } from "../middleware/inputValidationMiddleware.js";
import { refreshTokenCookieMiddleware } from "../middleware/refreshTokenCookieMiddleware.js";
import { registerSchema } from "../validation/registerSchema.js";
import { loginSchema } from "../validation/loginSchema.js";

const router = e.Router();

router.post("/register", inputValidationMiddleware(registerSchema), register);
router.post("/login", inputValidationMiddleware(loginSchema), login);
router.delete("/logout", refreshTokenCookieMiddleware, logout);

export const authRouter = router;
