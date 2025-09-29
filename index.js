import e from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";
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

app.listen(3300, async () => {
  console.log("server running port 3300");
});
