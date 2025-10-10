import DB from "./src/config/database.js";
import { UsersModel } from "./src/models/UsersModel.js";
import { RefreshTokenModel } from "./src/models/RefreshTokenModel.js";
import { LinksModel } from "./src/models/LinksModel.js";

const args = process.argv[2] || "";
const isForce = args.includes("force");
const isAlter = args.includes("alter");

async function migrate() {
  try {
    await DB.authenticate();
    if (isForce) {
      console.log("DBconnected, continue to sync with force = " + isForce);
      await DB.sync({
        force: isForce,
      });
    } else if (isAlter) {
      console.log("DBconnected, continue to sync with alter = " + isAlter);
      await DB.sync({
        alter: true,
      });
    } else {
      console.log("DBconnected, continue to sync with force = " + isForce);
      await DB.sync({
        force: false,
      });
    }
  } catch (error) {
    console.log(error);
  } finally {
    console.log("sync done");
    await DB.close();
  }
}

migrate();
