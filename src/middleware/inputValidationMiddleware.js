import { FormInputError } from "../utils/error.js";

export function inputValidationMiddleware(schema) {
  return (request, response, next) => {
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
