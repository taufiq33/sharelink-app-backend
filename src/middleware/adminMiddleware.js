import { ForbiddenError } from "../utils/error.js";

export function adminMiddleware(request, response, next) {
  try {
    if (request.user?.role !== "admin") {
      throw new ForbiddenError("forbidden");
    }

    next();
  } catch (error) {
    next(error);
  }
}
