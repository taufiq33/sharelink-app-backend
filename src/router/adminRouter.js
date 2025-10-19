import e from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { adminMiddleware } from "../middleware/adminMiddleware.js";
import { inputValidationMiddleware } from "../middleware/inputValidationMiddleware.js";
import { createNotificationSchema } from "../validation/createNotificationSchema.js";
import {
  createNotification,
  fetchNotifications,
} from "../controller/notificationController.js";
import { flagUser, getLinks, getUsers } from "../controller/adminController.js";

const router = e.Router();

router.use(authMiddleware, adminMiddleware);
router.get("/users", getUsers);
router.get("/links", getLinks);
router.patch("/users/active/:id", flagUser("active"));
router.patch("/users/block/:id", flagUser("block"));
router.post(
  "/notification",
  inputValidationMiddleware(createNotificationSchema),
  createNotification,
);
router.get("/notification", fetchNotifications);

export const adminRouter = router;
