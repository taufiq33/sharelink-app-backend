export class AuthError extends Error {
  constructor(message) {
    super(message);
    this.name = "Auth Error";
    this.status = 401;
  }
}

export class DataNotFound extends Error {
  constructor(message) {
    super(message);
    this.name = "Data not found";
    this.status = 404;
  }
}

export class FormInputError extends Error {
  constructor(message) {
    super(message);
    this.name = "Form Input error";
    this.status = 400;
  }
}

export class LoginError extends Error {
  constructor(message) {
    super(message);
    this.name = "LoginError";
    this.status = 401;
  }
}
