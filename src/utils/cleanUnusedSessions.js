import { RefreshTokenModel } from "../models/RefreshTokenModel.js";
import { Op } from "sequelize";

export async function cleanUnusedSessions() {
  try {
    const deleted = await RefreshTokenModel.destroy({
      where: {
        [Op.or]: [{ expiredAt: { [Op.lt]: new Date() } }, { isRevoked: true }],
      },
    });

    console.log(`[cleaning] ${deleted} unused sessions removed`);
  } catch (error) {
    console.error("[cleaning] unused session error:", error);
  }
}
