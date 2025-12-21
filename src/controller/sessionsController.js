import { RefreshTokenModel } from "../models/RefreshTokenModel.js";
import { BadRequestError } from "../utils/error.js";

function normalizeSessionLabel(label) {
  return {
    os: label.platform || "unknown",
    browser: label.browser || "unknown",
    version: label.version || null,
    deviceType: label.isMobile
      ? "mobile"
      : label.isTablet
      ? "tablet"
      : "desktop",
  };
}

export async function getSessions(request, response, next) {
  try {
    let sessions = await RefreshTokenModel.findAll({
      where: { userId: request.user.id, isRevoked: false },
      attributes: ["id", "sessionLabel", "createdAt"],
      raw: true,
    });

    sessions = sessions.map((item) => {
      if (item.id === request.refreshtokenId) {
        return {
          ...item,
          sessionLabel: normalizeSessionLabel(item.sessionLabel),
          currentSession: true,
        };
      } else {
        return {
          ...item,
          sessionLabel: normalizeSessionLabel(item.sessionLabel),
          currentSession: false,
        };
      }
    });

    response.json({
      success: true,
      message: "get sessions done.",
      data: {
        sessions: sessions,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function revokeSession(request, response, next) {
  if (!request.params?.id) {
    throw new BadRequestError("link id not supllied");
  }

  if (request.refreshtokenId === request.params.id) {
    throw new BadRequestError("can not revoke current session.");
  }

  try {
    const [affected] = await RefreshTokenModel.update(
      {
        isRevoked: true,
      },
      {
        where: { id: request.params.id, userId: request.user.id },
      }
    );
    if (affected > 0) {
      response.json({
        success: true,
        message: "revoke session done.",
      });
    } else {
      throw new BadRequestError("revoke session failed");
    }
  } catch (error) {
    next(error);
  }
}
