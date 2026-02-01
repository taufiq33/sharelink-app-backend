import e from "express";
import {
  getLinksByUsername,
  makeReport,
  photoProfile,
  track,
  singleDetailLink,
} from "../controller/publicController.js";
import { inputValidationMiddleware } from "../middleware/inputValidationMiddleware.js";

import { trackSchema } from "../validation/trackSchema.js";
import { reportingSchema } from "../validation/reportingSchema.js";

const router = e.Router();

router.get("/photoProfile/", photoProfile);
router.get("/photoProfile/:username", photoProfile);

router.get("/links/", getLinksByUsername);
router.get("/links/:username", getLinksByUsername);

router.get("/link/:id", singleDetailLink);

router.post(
  "/tracklink",
  inputValidationMiddleware(trackSchema),
  async (request, response, next) => {
    const refresh_token = request.cookies?.["refresh_token"];
    if (refresh_token) {
      console.log("user sdh login skip track");
      return response.sendStatus(204);
    } else {
      next();
    }
  },
  track,
);

router.post("/report", inputValidationMiddleware(reportingSchema), makeReport);

export const publicRouter = router;
