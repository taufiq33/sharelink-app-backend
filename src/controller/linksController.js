import { LinksModel } from "../models/LinksModel.js";
import { UsersModel } from "../models/UsersModel.js";

export async function getLinksByUser(request, response, next) {
  try {
    const LinksByUser = await LinksModel.findAll({
      where: { userId: request.user.id },
      order: [["order", "ASC"]],
      attributes: { exclude: ["deletedAt"] },
    });

    response.json({
      sucess: true,
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
    const data = await UsersModel.findByPk(request.user.id, {
      attributes: ["lastLinkOrder"],
    });

    const newLink = await LinksModel.create({
      label: request.body.label,
      link: request.body.link,
      order: (data.lastLinkOrder || 0) + 1,
      userId: request.user.id,
    });

    const [updateDB] = await UsersModel.update(
      { lastLinkOrder: data.lastLinkOrder + 1 },
      { where: { id: request.user.id } }
    );

    if (updateDB === 0) {
      throw Error("internal DB error");
    }

    return response.json({
      success: true,
      data: {
        message: "add Link done",
        link: {
          label: newLink.label,
          link: newLink.link,
          order: newLink.order,
        },
      },
    });
  } catch (error) {
    next(error);
  }
}
