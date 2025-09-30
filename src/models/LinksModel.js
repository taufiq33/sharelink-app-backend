import { DataTypes } from "sequelize";
import DB from "../config/database.js";
import { UsersModel } from "./UsersModel.js";

export const LinksModel = DB.define(
  "links",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    label: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    link: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    userId: {
      type: DataTypes.UUID,
      references: {
        model: "users",
        key: "id",
      },
    },
    order: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
    clickCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    paranoid: true,
  }
);

LinksModel.belongsTo(UsersModel, { foreignKey: "userId" });
UsersModel.hasMany(LinksModel, {
  foreignKey: "userId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
