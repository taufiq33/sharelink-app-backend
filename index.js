import e from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";
import useragent from "express-useragent";
import DB from "./src/config/database.js";
import { authRouter } from "./src/router/authRouter.js";
import { meRouter } from "./src/router/meRouter.js";
import { publicRouter } from "./src/router/publicRouter.js";
import { linksRouter } from "./src/router/linksRouter.js";
import { adminRouter } from "./src/router/adminRouter.js";
import { ErrorHandlerMiddleware } from "./src/middleware/errorHandlerMiddleware.js";
import { clearClickCacheAboveFiveMinutes } from "./src/utils/tracking.js";
import { INTERVAL_CLEAR_CLICK_CACHE_MS } from "./src/config/app_config.js";
import { notificationRouter } from "./src/router/notificationRouter.js";

dotenv.config();

const app = e();

app.use(useragent.express());
app.use(morgan("dev"));
app.use(cookieParser());
app.use(e.json());
app.use(
  cors({
    credentials: true,
    origin: "http://localhost:4200",
  }),
);

app.use("/auth", authRouter);
app.use("/me", meRouter);
app.use("/public", publicRouter);
app.use("/links", linksRouter);
app.use("/admin", adminRouter);
app.use("/notification", notificationRouter);

app.use(ErrorHandlerMiddleware);

setInterval(() => {
  clearClickCacheAboveFiveMinutes();
}, INTERVAL_CLEAR_CLICK_CACHE_MS);

app.listen(3300, async () => {
  console.log("server running port 3300");
  try {
    await DB.authenticate();
    console.log("Db connected");
  } catch (error) {
    console.log(error);
  }
});
