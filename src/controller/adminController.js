import { UsersModel } from "../models/UsersModel.js";
import { LinksModel } from "../models/LinksModel.js";
import { Sequelize } from "sequelize";

export async function getUsers(request, response, next) {
  try {
    const whereClause = request.query.userId
      ? {
          id: request.query.userId,
        }
      : {};
    const users = await UsersModel.findAll({
      where: whereClause,
      attributes: {
        exclude: ["password", "lastLinkOrder"],
        include: [
          [Sequelize.fn("COUNT", Sequelize.col("links.id")), "linksTotal"],
        ],
      },
      include: [
        {
          model: LinksModel,
          attributes: [],
        },
      ],
      group: ["users.id"],
    });

    console.log(users);
    response.json({
      success: true,
      data: {
        message: "get users done.",
        data: users,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function getLinks(request, response, next) {
  try {
    const whereClause = request.query.userId
      ? {
          userId: request.query.userId,
        }
      : {};
    const links = await LinksModel.findAll({
      where: whereClause,
      include: [
        {
          model: UsersModel,
          attributes: ["username"],
        },
      ],
    });

    response.json({
      success: true,
      data: {
        message: "get links done.",
        data: links,
      },
    });
  } catch (error) {
    next(error);
  }
}

export function flagUser(type) {
  const value = type === "active" ? true : false;
  return async (request, response, next) => {
    try {
      const [updateFlag] = await UsersModel.update(
        {
          active: value,
        },
        {
          where: {
            id: request.params.id,
          },
        },
      );

      if (updateFlag === 0) {
        throw Error("internal db error");
      }

      response.json({
        success: true,
        data: {
          message: `set flag ${value} for ${request.params.id} done.`,
        },
      });
    } catch (error) {
      next(error);
    }
  };
}
