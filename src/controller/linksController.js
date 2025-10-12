import DB from "../config/database.js";
import { LinksModel } from "../models/LinksModel.js";
import { UsersModel } from "../models/UsersModel.js";
import { ForbiddenError } from "../utils/error.js";

export async function getLinksByUser(request, response, next) {
  try {
    const LinksByUser = await LinksModel.findAll({
      where: { userId: request.user.id },
      order: [["order", "ASC"]],
      attributes: { exclude: ["deletedAt"] },
    });

    response.json({
      success: true,
      data: {
        message: "getLinks done",
        links: LinksByUser,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function addLinksByUser(request, response, next) {
  try {
    const results = await DB.transaction(async (t) => {
      const data = await UsersModel.findByPk(request.user.id, {
        attributes: ["lastLinkOrder"],
        transaction: t,
      });

      const newLink = await LinksModel.create(
        {
          label: request.body.label,
          link: request.body.link,
          order: (data.lastLinkOrder || 0) + 1,
          userId: request.user.id,
        },
        { transaction: t }
      );

      const [updateDB] = await UsersModel.update(
        { lastLinkOrder: data.lastLinkOrder + 1 },
        { where: { id: request.user.id }, transaction: t }
      );

      if (updateDB === 0) {
        throw Error("internal DB error");
      }

      return newLink;
    });

    return response.json({
      success: true,
      data: {
        message: "add Link done",
        link: {
          label: results.label,
          link: results.link,
          order: results.order,
        },
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function reorderLink(request, response, next) {
  try {
    const results = await DB.transaction(async (t) => {
      let linksUserByDB = await LinksModel.findAll({
        where: { userId: request.user.id },
        attributes: ["id"],
        raw: true,
        transaction: t,
      });

      linksUserByDB = linksUserByDB.map((item) => item.id);

      const userLinksIds = new Set(linksUserByDB);

      request.body.links.forEach((item) => {
        if (!userLinksIds.has(item)) {
          throw new ForbiddenError("forbidden request");
        }
      });

      const updates = request.body.links.map((item, index) => {
        return {
          id: item,
          order: index + 1,
        };
      });

      const linksOrderUpdate = await Promise.all(
        updates.map((item) => {
          return LinksModel.update(
            { order: item.order },
            { where: { userId: request.user.id, id: item.id }, transaction: t }
          );
        })
      );

      const allSucceeded = linksOrderUpdate.every(
        ([affectedRows]) => affectedRows === 1
      );

      if (!allSucceeded) {
        throw Error("internal DB error");
      }

      const linksAfterReOrder = await LinksModel.findAll({
        where: { userId: request.user.id },
        order: [["order", "ASC"]],
        transaction: t,
      });

      return linksAfterReOrder;
    });

    return response.json({
      success: true,
      data: {
        message: "reorder links done.",
        links: results,
      },
    });
  } catch (error) {
    next(error);
  }
}
