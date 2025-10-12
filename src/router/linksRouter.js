import e from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import {
  addLinksByUser,
  getLinksByUser,
  reorderLink,
  singleDetailLink,
  singleEditLink,
} from "../controller/linksController.js";
import { inputValidationMiddleware } from "../middleware/inputValidationMiddleware.js";
import { linkSchema } from "../validation/linkSchema.js";
import { reorderSchema } from "../validation/reorderSchema.js";

const router = e.Router();

router.get("/", authMiddleware, getLinksByUser);
router.get("/:id", authMiddleware, singleDetailLink);
router.post(
  "/",
  authMiddleware,
  inputValidationMiddleware(linkSchema),
  addLinksByUser
);
router.put(
  "/reorder",
  authMiddleware,
  inputValidationMiddleware(reorderSchema),
  reorderLink
);
router.put(
  "/:id",
  authMiddleware,
  inputValidationMiddleware(linkSchema),
  singleEditLink
);

export const linksRouter = router;
