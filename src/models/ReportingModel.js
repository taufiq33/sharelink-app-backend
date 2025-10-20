import DB from "../config/database.js";
import { DataTypes } from "sequelize";
import { UsersModel } from "./UsersModel.js";
import { LinksModel } from "./LinksModel.js";

export const ReportingModel = DB.define("reporting", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userReporter: {
    type: DataTypes.UUID,
    defaultValue: null,
    allowNull: true,
    references: {
      model: "users",
      key: "id",
    },
  },
  userTarget: {
    type: DataTypes.UUID,
    references: {
      model: "users",
      key: "id",
    },
  },
  linkTarget: {
    type: DataTypes.UUID,
    references: {
      model: "links",
      key: "id",
    },
    onUpdate: "CASCADE",
    onDelete: "SET NULL",
  },
  type: {
    type: DataTypes.ENUM("user", "link"),
    allowNull: false,
  },
  markReview: {
    type: DataTypes.ENUM("done", "waiting", "rejected"),
    defaultValue: "waiting",
  },
  reason: {
    type: DataTypes.TEXT,
  },
});

ReportingModel.belongsTo(UsersModel, {
  foreignKey: "userReporter",
  as: "reporter",
});
ReportingModel.belongsTo(UsersModel, {
  foreignKey: "userTarget",
  as: "target",
});
ReportingModel.belongsTo(LinksModel, {
  foreignKey: "linkTarget",
  as: "link",
});

UsersModel.hasMany(ReportingModel, {
  foreignKey: "userTarget",
  as: "reportsReceived",
});

LinksModel.hasMany(ReportingModel, {
  foreignKey: "linkTarget",
  as: "reports",
});
