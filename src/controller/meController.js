import { UsersModel } from "../models/UsersModel.js";
import { DataNotFoundError } from "../utils/error.js";
import { APP_BASE_URL, PHOTO_PROFILE_USER_DIR } from "../config/app_config.js";
import { LinksModel } from "../models/LinksModel.js";
import fs from "fs/promises";
import path from "path";

export async function loadSelfProfile(request, response, next) {
  try {
    const user = await UsersModel.findByPk(request.user.id);

    if (!user) return next(DataNotFoundError("not found"));

    return response.json({
      success: true,
      data: {
        message: "success get user profile",
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          role: user.role,
          shortBio: user.shortBio,
          avatarUrl: `${APP_BASE_URL}/public/photoProfile/${user.username}`,
          active: user.active,
        },
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function loadStatistics(request, response, next) {
  try {
    const links = await LinksModel.findAll({
      where: { userId: request.user.id },
      raw: true,
    });
    const totalLink = links.length;
    const totalClick = links.reduce((total, item) => {
      total += item.clickCount;
      return total;
    }, 0);

    response.json({
      success: true,
      message: "fetch user statistic done.",
      data: { username: request.user.username, totalLink, totalClick },
    });
  } catch (error) {
    next(error);
  }
}

export async function deletePhotoProfile(request, response, next) {
  const transaction = await UsersModel.sequelize.transaction();
  try {
    const user = await UsersModel.findByPk(request.user.id, {
      attributes: ["avatarUrl", "id"],
      transaction,
    });

    if (!user) {
      await transaction.rollback();
      throw new DataNotFoundError("User not found");
    }

    const oldAvatarUrl = user.avatarUrl;

    await user.update({ avatarUrl: null }, { transaction });

    await transaction.commit();

    if (oldAvatarUrl) {
      fs.unlink(path.join(PHOTO_PROFILE_USER_DIR, oldAvatarUrl)).catch(
        (error) => {
          console.error("Failed to delete avatar file:", {
            userId: request.user.id,
            fileName: oldAvatarUrl,
            error: error.message,
          });
        },
      );
    }

    return response.json({
      success: true,
      message: "remove photo profile success",
    });
  } catch (error) {
    if (transaction && !transaction.finished) {
      await transaction.rollback();
    }
    next(error);
  }
}
