import DB from "./src/config/database.js";
import { UsersModel } from "./src/models/UsersModel.js";
import { RefreshTokenModel } from "./src/models/RefreshTokenModel.js";
import { LinksModel } from "./src/models/LinksModel.js";

async function migrate() {
  try {
    await DB.authenticate();
    console.log("DBconnected");
    await DB.sync({
      force: true,
    });
    console.log("migrate done");
  } catch (error) {
    console.log(error);
  }
}

migrate();
