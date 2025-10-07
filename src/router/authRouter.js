import e from "express";
import {
  register,
  login,
  logout,
  token,
  updateProfile,
} from "../controller/authController.js";
import { inputValidationMiddleware } from "../middleware/inputValidationMiddleware.js";
import { refreshTokenCookieMiddleware } from "../middleware/refreshTokenCookieMiddleware.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { imageUploadMiddleware } from "../middleware/imageUploadMiddleware.js";
import { imageFileValidation } from "../validation/imageFileValidation.js";
import { registerSchema } from "../validation/registerSchema.js";
import { loginSchema } from "../validation/loginSchema.js";
import { updateProfileSchema } from "../validation/updateProfileSchema.js";

const router = e.Router();

router.post("/register", inputValidationMiddleware(registerSchema), register);
router.post(
  "/register/nextStep",
  authMiddleware,
  imageUploadMiddleware("photoProfile"),
  imageFileValidation,
  inputValidationMiddleware(updateProfileSchema.partial()),
  updateProfile
);
router.post("/login", inputValidationMiddleware(loginSchema), login);
router.delete("/logout", refreshTokenCookieMiddleware, logout);
router.post("/token", refreshTokenCookieMiddleware, token);

export const authRouter = router;
