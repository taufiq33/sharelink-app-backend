import { Op } from "sequelize";
import { RefreshTokenModel } from "../models/RefreshTokenModel.js";

import { verifyToken } from "../utils/token.js";

export async function optionalRefreshTokenCookieMiddleware(
  request,
  response,
  next,
) {
  try {
    const refresh_token = request.cookies?.["refresh_token"];
    if (!refresh_token) {
      return next();
    }

    const decodedUser = await verifyToken(refresh_token, true);

    if (!decodedUser) {
      return next();
    }

    const refreshTokenInDB = await RefreshTokenModel.findOne({
      where: {
        token: refresh_token,
        userId: decodedUser.id,
        isRevoked: false,
        expiredAt: {
          [Op.gt]: new Date(),
        },
      },
    });

    if (!refreshTokenInDB) {
      return next();
    }

    request.refreshtokenId = refreshTokenInDB.id;
    request.userId = refreshTokenInDB.userId;
    next();
  } catch (error) {
    next(error);
  }
}
