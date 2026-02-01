import chalk from "chalk";
import cookieParser from "cookie-parser";
import "dotenv/config";
import express from "express";
import morgan from "morgan";
import connectionToDB from "./config/connectDB.js";
import { morganMiddleware, systemLogs } from "./utils/Logger.js";
import mongoSanitize from "express-mongo-sanitize";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
await connectionToDB();
const app = express();

if (process.env.NODE_ENV == "development") {
  app.use(morgan("dev"));
}
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cookieParser());
app.use(mongoSanitize());
app.use(morganMiddleware);

app.get("/api/v1/test", (req, res) => {
  res.json({ Hi: "Welcome to the invoice app" });
});

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 1997;
app.listen(PORT, () => {
  console.log(
    `server is running in ${process.env.NODE_ENV} mode on port ${PORT}`,
  );
  systemLogs.info(
    `Server is running in ${process.env.NODE_ENV} mode on port ${process.env.PORT}`,
  );
});
Ali - Sina - 255;