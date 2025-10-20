import path from "path";
import fs from "fs";
import { UsersModel } from "../models/UsersModel.js";
import { BadRequestError, DataNotFoundError } from "../utils/error.js";
import {
  PHOTO_PROFILE_DEFAULT_DIR,
  PHOTO_PROFILE_USER_DIR,
} from "../config/app_config.js";
import { LinksModel } from "../models/LinksModel.js";
import { ReportingModel } from "../models/ReportingModel.js";
import { isLimit, isSpam } from "../utils/tracking.js";

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

export async function getLinksByUsername(request, response, next) {
  try {
    if (!request.params?.username) {
      return next(new BadRequestError("username not suplied."));
    }

    if (request.params?.username === "admin") {
      return next(new DataNotFoundError("invalid username"));
    }

    const linksByUsername = await UsersModel.findOne({
      where: { username: request.params.username },
      attributes: ["username"],
      include: [
        {
          model: LinksModel,
          attributes: ["label", "link", "id"],
        },
      ],
    });

    if (!linksByUsername) {
      return next(new DataNotFoundError("links not found"));
    }

    response.json({
      success: true,
      data: {
        message: "get links by username done",
        username: linksByUsername.username,
        links: linksByUsername.links,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function track(request, response) {
  response.sendStatus(204);

  setImmediate(async () => {
    if (!isLimit(request.body.deviceId)) {
      if (!isSpam(request.body.deviceId, request.body.linkId)) {
        console.log("lolos spam dan limit");
        const link = await LinksModel.findByPk(request.body.linkId);
        if (!link) {
          console.error("link not found");
        }
        await link.increment("clickCount");
      } else {
        console.log("spam!!");
      }
    } else {
      console.log("limit!!");
    }
    // console.log(
    //   `${new Date()} => ${request.body.deviceId} - ${isLimitRequest}`
    // );
  });
}

export async function makeReport(request, response, next) {
  try {
    const newReport = {
      type: request.body.type,
      reason: request.body.reason,
      userReporter: request.body.userReporter,
      userTarget: request.body.userTarget,
      linkTarget: request.body?.linkTarget || null,
    };
    await ReportingModel.create(newReport);

    response.json({
      success: true,
      data: {
        message: "submit report done.",
        data: newReport,
      },
    });
  } catch (error) {
    next(error);
  }
}
