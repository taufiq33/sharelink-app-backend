import e from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";
import useragent from "express-useragent";
import DB from "./src/config/database.js";
import { authRouter } from "./src/router/authRouter.js";
import { ErrorHandlerMiddleware } from "./src/middleware/errorHandlerMiddleware.js";

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
  })
);

app.use("/auth", authRouter);

app.use(ErrorHandlerMiddleware);

app.listen(3300, async () => {
  console.log("server running port 3300");
  try {
    await DB.authenticate();
    console.log("Db connected");
  } catch (error) {
    console.log(error);
  }
});
