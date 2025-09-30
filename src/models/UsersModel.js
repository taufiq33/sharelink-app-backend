import { DataTypes } from "sequelize";
import DB from "../config/database.js";

export const UsersModel = DB.define("users", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  username: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    validate: {
      isEmail: true,
    },
    allowNull: false,
  },
  password: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  shortBio: {
    type: DataTypes.TEXT,
  },
  avatarUrl: {
    type: DataTypes.STRING,
  },
  role: {
    type: DataTypes.ENUM,
    values: ["user", "admin"],
    defaultValue: "user",
  },
  active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
});
