import { BadRequestError, FormInputError } from "../utils/error.js";

export function inputValidationMiddleware(schema) {
  return (request, response, next) => {
    if (!request.body) {
      throw new BadRequestError(
        `${Object.keys(schema.shape).toString()} can not be null`
      );
    }
    try {
      schema.parse(request.body);
      next();
    } catch (error) {
      next(
        new FormInputError(
          "validationInputError",
          error.issues.map((item) => ({
            path: item.path.join("."),
            message: item.message,
          }))
        )
      );
    }
  };
}
