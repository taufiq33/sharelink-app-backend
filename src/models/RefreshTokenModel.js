import { DataTypes } from "sequelize";
import DB from "../config/database.js";
import { UsersModel } from "./UsersModel.js";

export const RefreshTokenModel = DB.define("refreshToken", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  token: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  expiredAt: {
    type: DataTypes.DATE,
    validate: {
      isDate: true,
    },
  },
  userId: {
    type: DataTypes.UUID,
    references: {
      model: "users",
      key: "id",
    },
  },
  isRevoked: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  sessionLabel: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
});

RefreshTokenModel.belongsTo(UsersModel, { foreignKey: "userId" });
UsersModel.hasMany(RefreshTokenModel, {
  foreignKey: "userId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
