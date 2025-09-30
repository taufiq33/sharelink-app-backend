export function ErrorHandlerMiddleware(error, request, response, _next) {
  console.error(error.fields);

  const responseJson = {
    name: error?.name || "internal Error",
    message: error?.message || "internal error",
  };

  if (error.name === "Form Input Validation error") {
    if (error?.fields) {
      responseJson.fields = error.fields;
    }
  }

  if (error.name === "SequelizeUniqueConstraintError") {
    responseJson.name = "Data already exists";
    error.status = 400;
    const keys = Object.keys(error.fields).join(", ");
    responseJson.message = `${keys} already exist`;
  }

  response.status(error?.status || 500).json({
    error: true,
    data: responseJson,
  });
} // untuk error handler, express butuh 4 parameter , jika tdk lengkap, dianggap middleware biasa.
