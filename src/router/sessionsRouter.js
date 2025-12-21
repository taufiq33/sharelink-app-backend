import express from "express";
import {
  getSessions,
  revokeSession,
} from "../controller/sessionsController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { refreshTokenCookieMiddleware } from "../middleware/refreshTokenCookieMiddleware.js";

const router = express.Router();

router.get("/", authMiddleware, refreshTokenCookieMiddleware, getSessions);
router.post(
  "/revoke/:id",
  authMiddleware,
  refreshTokenCookieMiddleware,
  revokeSession
);

export const sessionsRouter = router;
