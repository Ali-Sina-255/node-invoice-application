import chalk from "chalk";
import cookieParser from "cookie-parser";
import "dotenv/config";
import express from "express";
import morgan from "morgan";
import mongoSanitize from "express-mongo-sanitize";

import connectionToDB from "./config/connectDB.js";
import { morganMiddleware, systemLogs } from "./utils/Logger.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

import routes from "./routes/index.js";

const startServer = async () => {
  try {
    await connectionToDB();
    console.log(chalk.green("✅ Database connected successfully"));

    const app = express();

    if (process.env.NODE_ENV === "development") {
      app.use(morgan("dev"));
    }

    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
    app.use(cookieParser());
    app.use(mongoSanitize());
    app.use(morganMiddleware);

    app.get("/api/v1/test", (req, res) => {
      res.json({ message: "Welcome to the invoice app" });
    });

    // Routes
    app.use("/api/v1/auth", routes.authRoutes);
    app.use("/api/v1/invoice", routes.invoiceRoutes); // optional

    // Error handling
    app.use(notFound);
    app.use(errorHandler);

    const PORT = process.env.PORT || 1997;
    app.listen(PORT, () => {
      console.log(
        chalk.blue(
          `🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`,
        ),
      );
      systemLogs.info(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error(chalk.red("❌ Failed to start server:"), err);
    systemLogs.error(`Server failed to start: ${err.message}`);
    process.exit(1);
  }
};

startServer();
