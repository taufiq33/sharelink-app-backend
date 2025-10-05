import e from "express";
import { photoProfile } from "../controller/publicController.js";

const router = e.Router();

router.get("/photoProfile/:username", photoProfile);

export const publicRouter = router;
