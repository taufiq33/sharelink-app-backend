import jsonwebtoken from "jsonwebtoken";
import {
  ACCESS_TOKEN_SECRET_KEY,
  REFRESH_TOKEN_SECRET_KEY,
  ACCESS_TOKEN_EXPIRED_MS,
  REFRESH_TOKEN_EXPIRED_MS,
} from "../config/app_config.js";

export function verifyToken(token, refToken = false) {
  return new Promise((resolve, reject) => {
    const secret = refToken
      ? REFRESH_TOKEN_SECRET_KEY
      : ACCESS_TOKEN_SECRET_KEY;

    jsonwebtoken.verify(token, secret, (error, decoded) => {
      if (error) {
        return reject(error);
      }

      return resolve(decoded);
    });
  });
}

export function generateToken(payload, refToken = false) {
  const secret = refToken ? REFRESH_TOKEN_SECRET_KEY : ACCESS_TOKEN_SECRET_KEY;
  let expiredTime = refToken
    ? REFRESH_TOKEN_EXPIRED_MS
    : ACCESS_TOKEN_EXPIRED_MS;

  expiredTime = expiredTime / 1000;

  return jsonwebtoken.sign(payload, secret, {
    expiresIn: expiredTime,
  });
}
