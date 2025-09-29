import { Sequelize } from "sequelize";
import { DB_HOST, DB_NAME, DB_USER, DB_PASSWORD } from "./app_config.js";

const DB = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  dialect: "postgres",
});

export default DB;
