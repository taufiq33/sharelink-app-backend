import e from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import {
  addLinksByUser,
  deleteLinkByUserId,
  getLinksByUser,
  reorderLink,
  singleDetailLink,
  singleEditLink,
} from "../controller/linksController.js";
import { inputValidationMiddleware } from "../middleware/inputValidationMiddleware.js";
import { ownerShipMiddleware } from "../middleware/ownershipMiddleware.js";
import { linkSchema } from "../validation/linkSchema.js";
import { reorderSchema } from "../validation/reorderSchema.js";
import { LinksModel } from "../models/LinksModel.js";

const router = e.Router();

router.get("/", authMiddleware, getLinksByUser);
router.get(
  "/:id",
  authMiddleware,
  ownerShipMiddleware(LinksModel, "id"),
  singleDetailLink
);
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

router.delete(
  "/:id",
  authMiddleware,
  ownerShipMiddleware(LinksModel, "id"),
  deleteLinkByUserId
);

export const linksRouter = router;
