import {
  BadRequestError,
  DataNotFoundError,
  ForbiddenError,
} from "../utils/error.js";

export function ownerShipMiddleware(model, fieldName) {
  return async (request, response, next) => {
    if (!request.params?.[fieldName]) {
      throw new BadRequestError(`${fieldName} not suplied`);
    }
    try {
      const resource = await model.findByPk(request.params[fieldName]);
      if (!resource) {
        throw new DataNotFoundError(`${model.name} not found`);
      }

      if (request.user.role !== "admin") {
        if (resource.userId !== request.user.id) {
          throw new ForbiddenError("forbidden request");
        }
      }

      request.resource = resource;
      next();
    } catch (error) {
      next(error);
    }
  };
}
