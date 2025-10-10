import e from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import {
  addLinksByUser,
  getLinksByUser,
} from "../controller/linksController.js";
import { inputValidationMiddleware } from "../middleware/inputValidationMiddleware.js";
import { linkSchema } from "../validation/linkSchema.js";

const router = e.Router();

router.get("/", authMiddleware, getLinksByUser);
router.post(
  "/",
  authMiddleware,
  inputValidationMiddleware(linkSchema),
  addLinksByUser
);

export const linksRouter = router;
