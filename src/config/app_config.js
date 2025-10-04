import dotenv from "dotenv";
import path from "path";
dotenv.config();

export const ACCESS_TOKEN_SECRET_KEY = process.env.ACCESS_TOKEN_SECRET_KEY;
export const REFRESH_TOKEN_SECRET_KEY = process.env.REFRESH_TOKEN_SECRET_KEY;
export const DB_HOST = process.env.DB_HOST;
export const DB_USER = process.env.DB_USER;
export const DB_PASSWORD = process.env.DB_PASSWORD;
export const DB_NAME = process.env.DB_NAME;
export const ACCESS_TOKEN_EXPIRED_MS = 5 * 1000 * 60; // 5min
export const REFRESH_TOKEN_EXPIRED_MS = 1000 * 60 * 15; // 15min
export const ALLOWED_IMAGE_TYPE = [
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/webp",
];

export const MAX_FILE_IMAGE_SIZE = 3 * 1024 * 1024; //3MB

export const PHOTO_PROFILE_DIR = path.join(
  process.cwd() + "/uploads/photoProfile"
);
