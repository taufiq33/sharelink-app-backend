import e from "express";
import {
  loadSelfProfile,
  loadStatistics,
  deletePhotoProfile,
} from "../controller/meController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { updateProfile } from "../controller/authController.js";
import { imageUploadMiddleware } from "../middleware/imageUploadMiddleware.js";
import { inputValidationMiddleware } from "../middleware/inputValidationMiddleware.js";
import { imageFileValidation } from "../validation/imageFileValidation.js";
import { updateProfileSchema } from "../validation/updateProfileSchema.js";
const router = e.Router();

router.get("/", authMiddleware, loadSelfProfile);
router.get("/statistics", authMiddleware, loadStatistics);
router.put(
  "/",
  authMiddleware,
  imageUploadMiddleware("photoProfile", true),
  imageFileValidation,
  inputValidationMiddleware(updateProfileSchema),
  updateProfile,
);
router.delete("/photoProfile", authMiddleware, deletePhotoProfile);

export const meRouter = router;
