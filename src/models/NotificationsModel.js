import { DataTypes } from "sequelize";
import DB from "../config/database.js";
import { UsersModel } from "./UsersModel.js";
import { LinksModel } from "./LinksModel.js";

export const NotificationsModel = DB.define("notifications", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    references: {
      model: "users",
      key: "id",
    },
  },
  isRead: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  redirectUrl: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

NotificationsModel.belongsTo(UsersModel, { foreignKey: "userId" });
UsersModel.hasMany(LinksModel, {
  foreignKey: "userId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
