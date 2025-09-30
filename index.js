import e from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";

import DB from "./src/config/database.js";

dotenv.config();

const app = e();

app.use(morgan("dev"));
app.use(cookieParser());
app.use(e.json());
app.use(
  cors({
    credentials: true,
    origin: "http://localhost:4200",
  })
);

app.use((error, request, response, _next) => {
  response.status(error?.status || 500).json({
    name: error?.name || "internal Error",
    message: error?.message || "internal error",
  });
});

app.listen(3300, async () => {
  console.log("server running port 3300");
  try {
    await DB.authenticate();
    console.log("Db connected");
  } catch (error) {
    console.log(error);
  }
});
