import DB from "./src/config/database.js";
import { UsersModel } from "./src/models/UsersModel.js";
import { RefreshTokenModel } from "./src/models/RefreshTokenModel.js";
import { LinksModel } from "./src/models/LinksModel.js";

const args = process.argv[2] || "";
const isForce = args.includes("force");

async function migrate() {
  try {
    await DB.authenticate();
    console.log("DBconnected, continue to sync with force = " + isForce);
    await DB.sync({
      force: isForce,
    });
    console.log("sync done");
  } catch (error) {
    console.log(error);
  } finally {
    await DB.close();
  }
}

migrate();
