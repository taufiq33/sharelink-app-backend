import e from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { adminMiddleware } from "../middleware/adminMiddleware.js";
import { flagUser, getLinks, getUsers } from "../controller/adminController.js";

const router = e.Router();

router.use(authMiddleware, adminMiddleware);
router.get("/users", getUsers);
router.get("/links", getLinks);
router.patch("/users/active/:id", flagUser("active"));
router.patch("/users/block/:id", flagUser("block"));

export const adminRouter = router;
