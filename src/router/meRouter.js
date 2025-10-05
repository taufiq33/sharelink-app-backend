import e from "express";
import { loadSelfProfile } from "../controller/meController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
const router = e.Router();

router.get("/", authMiddleware, loadSelfProfile);

export const meRouter = router;
