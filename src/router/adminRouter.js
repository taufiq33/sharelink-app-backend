import e from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { adminMiddleware } from "../middleware/adminMiddleware.js";
import { inputValidationMiddleware } from "../middleware/inputValidationMiddleware.js";
import { createNotificationSchema } from "../validation/createNotificationSchema.js";
import { markSchema } from "../validation/markSchema.js";
import {
  createNotification,
  fetchNotifications,
} from "../controller/notificationController.js";
import {
  flagUser,
  getLinks,
  getReports,
  getUsers,
  markReport,
  loadStats,
  loadLast5DayStats,
} from "../controller/adminController.js";

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
router.patch(
  "/reports/mark/:id",
  inputValidationMiddleware(markSchema),
  markReport,
);
router.get("/reports", getReports);

router.post("/getStats", loadStats);
router.post("/getRecentStats", loadLast5DayStats);

export const adminRouter = router;
