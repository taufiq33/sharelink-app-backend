import { Op } from "sequelize";
import { RefreshTokenModel } from "../models/RefreshTokenModel.js";
import { AuthError } from "../utils/error.js";
import { verifyToken } from "../utils/token.js";

export async function refreshTokenCookieMiddleware(request, response, next) {
  try {
    const refresh_token = request.cookies?.["refresh_token"];
    if (!refresh_token) {
      throw new AuthError("invalid credentials");
    }

    const decodedUser = await verifyToken(refresh_token, true);

    if (!decodedUser) {
      throw new AuthError("invalid credentials");
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
      throw new AuthError("invalid credentials");
    }

    request.refreshtokenId = refreshTokenInDB.id;
    request.userId = refreshTokenInDB.userId;
    next();
  } catch (error) {
    next(error);
  }
}
