import dotenv from "dotenv";
dotenv.config();

export const ACCESS_TOKEN_SECRET_KEY = process.env.ACCESS_TOKEN_SECRET_KEY;
export const REFRESH_TOKEN_SECRET_KEY = process.env.REFRESH_TOKEN_SECRET_KEY;
export const DB_HOST = process.env.DB_HOST;
export const DB_USER = process.env.DB_USER;
export const DB_PASSWORD = process.env.DB_PASSWORD;
export const DB_NAME = process.env.DB_NAME;
export const ACCESS_TOKEN_EXPIRED_MS = 1000 * 60; // 1min
export const REFRESH_TOKEN_EXPIRED_MS = 1000 * 60 * 15; // 15min
