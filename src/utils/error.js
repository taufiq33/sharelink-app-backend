export class AuthError extends Error {
  constructor(message) {
    super(message);
    this.name = "AuthError";
    this.status = 401;
  }
}

export class DataNotFound extends Error {
  constructor(message) {
    super(message);
    this.name = "DataNotFound";
    this.status = 404;
  }
}

export class FormInputError extends Error {
  constructor(message, fields) {
    super(message);
    this.name = "FormInputError";
    this.status = 400;
    this.fields = fields;
  }
}

export class LoginError extends Error {
  constructor(message) {
    super(message);
    this.name = "LoginError";
    this.status = 401;
  }
}

export class ImageUploadError extends Error {
  constructor(message) {
    super(message);
    this.name = "ImageUploadError";
    this.status = 400;
  }
}
