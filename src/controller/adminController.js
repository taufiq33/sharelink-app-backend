import { UsersModel } from "../models/UsersModel.js";
import { LinksModel } from "../models/LinksModel.js";
import { Sequelize, Op, fn, col } from "sequelize";
import { ReportingModel } from "../models/ReportingModel.js";
import { format } from "date-fns";

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

export async function markReport(request, response, next) {
  try {
    const [markReport] = await ReportingModel.update(
      { markReview: request.body.mark },
      { where: { id: request.params.id } },
    );

    if (markReport === 0) {
      throw Error("internal db error");
    }

    response.json({
      success: true,
      data: {
        message: `mark report as "${request.body.mark}" done.`,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function getReports(request, response, next) {
  try {
    const reports = await ReportingModel.findAll({
      include: [
        {
          model: UsersModel,
          as: "reporter",
          attributes: ["id", "username"],
        },
        {
          model: UsersModel,
          as: "target",
          attributes: ["id", "username"],
        },
        {
          model: LinksModel,
          as: "link",
          attributes: ["id", "label", "link"],
        },
      ],
    });

    response.json({
      success: true,
      data: {
        message: `fetch reports done`,
        reports,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function loadStats(request, response, next) {
  try {
    const [users, links, reports] = await Promise.all([
      UsersModel.count({ where: { active: true } }),
      LinksModel.count(),
      ReportingModel.count(),
    ]);

    response.json({
      success: true,
      data: {
        message: `load Stats done`,
        stats: { users, links, reports },
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function loadLast5DayStats(request, response, next) {
  try {
    const endDate = new Date();
    endDate.setHours(23, 59, 59, 999);
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - 4);
    startDate.setHours(0, 0, 0, 0);

    const days = [];
    for (let i = 4; i >= 0; i--) {
      let date = new Date(endDate);
      date.setDate(endDate.getDate() - i);
      days.push(format(date, "yyyy-MM-dd"));
    }

    const [usersPerDay, linksPerDay, reportsPerDay] = await Promise.all([
      UsersModel.findAll({
        attributes: [
          [fn("DATE", col("createdAt")), "date"],
          [fn("COUNT", col("id")), "users"],
        ],
        where: {
          active: true,
          createdAt: {
            [Op.between]: [startDate, endDate],
          },
        },
        group: [fn("DATE", col("createdAt"))],
        raw: true,
      }),

      LinksModel.findAll({
        attributes: [
          [fn("DATE", col("createdAt")), "date"],
          [fn("COUNT", col("id")), "links"],
        ],
        where: {
          createdAt: {
            [Op.between]: [startDate, endDate],
          },
        },
        group: [fn("DATE", col("createdAt"))],
        raw: true,
      }),

      ReportingModel.findAll({
        attributes: [
          [fn("DATE", col("createdAt")), "date"],
          [fn("COUNT", col("id")), "reports"],
        ],
        where: {
          createdAt: {
            [Op.between]: [startDate, endDate],
          },
        },
        group: [fn("DATE", col("createdAt"))],
        raw: true,
      }),
    ]);

    const map = Object.fromEntries(
      days.map((date) => [date, { date, users: 0, links: 0, reports: 0 }]),
    );

    for (const u of usersPerDay) {
      map[u.date].users = Number(u.users);
    }

    for (const l of linksPerDay) {
      map[l.date].links = Number(l.links);
    }

    for (const r of reportsPerDay) {
      map[r.date].reports = Number(r.reports);
    }

    response.json({
      success: true,
      data: {
        message: `load last 5 day Stats done`,
        stats: Object.values(map),
      },
    });
  } catch (error) {
    next(error);
  }
}
