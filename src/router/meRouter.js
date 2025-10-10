import e from "express";
import { loadSelfProfile } from "../controller/meController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { updateProfile } from "../controller/authController.js";
import { imageUploadMiddleware } from "../middleware/imageUploadMiddleware.js";
import { inputValidationMiddleware } from "../middleware/inputValidationMiddleware.js";
import { imageFileValidation } from "../validation/imageFileValidation.js";
import { updateProfileSchema } from "../validation/updateProfileSchema.js";
const router = e.Router();

router.get("/", authMiddleware, loadSelfProfile);
router.put(
  "/",
  authMiddleware,
  imageUploadMiddleware("photoProfile", true),
  imageFileValidation,
  inputValidationMiddleware(updateProfileSchema),
  updateProfile
);

export const meRouter = router;
