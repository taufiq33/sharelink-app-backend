import e from "express";
import {
  getLinksByUsername,
  photoProfile,
} from "../controller/publicController.js";

const router = e.Router();

router.get("/photoProfile/", photoProfile);
router.get("/photoProfile/:username", photoProfile);

router.get("/links/", getLinksByUsername);
router.get("/links/:username", getLinksByUsername);

export const publicRouter = router;
