import e from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import {
  fetchNotificationByUser,
  markNotificationAsRead,
} from "../controller/notificationController.js";

const router = e.Router();

router.patch("/read/:id", authMiddleware, markNotificationAsRead);
router.post("/", authMiddleware, fetchNotificationByUser);

export const notificationRouter = router;
