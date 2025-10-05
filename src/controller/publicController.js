import path from "path";
import fs from "fs";
import { UsersModel } from "../models/UsersModel.js";
import { BadRequestError, DataNotFoundError } from "../utils/error.js";
import {
  PHOTO_PROFILE_DEFAULT_DIR,
  PHOTO_PROFILE_USER_DIR,
} from "../config/app_config.js";

export async function photoProfile(request, response, next) {
  try {
    if (!request.params?.username) {
      return next(new BadRequestError("username not suplied."));
    }

    const userByUsername = await UsersModel.findOne({
      where: {
        username: request.params.username,
      },
    });

    if (!userByUsername) {
      return next(new DataNotFoundError("user not found"));
    }

    const filePath = userByUsername.avatarUrl
      ? path.join(PHOTO_PROFILE_USER_DIR, userByUsername.avatarUrl)
      : path.join(PHOTO_PROFILE_DEFAULT_DIR, "default.webp");

    console.log(filePath);

    if (!fs.existsSync(filePath)) {
      return next(new DataNotFoundError("photoProfile not found"));
    }

    return response.sendFile(filePath);
  } catch (error) {
    next(error);
  }
}
