import mongoose from "mongoose";
import chalk from "chalk"; // ✅ Add this
import { systemLogs } from "../utils/Logger.js";

const connectionToDB = async () => {
  try {
    const connect = await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(
      chalk.green.bold(`MongoDB Connected: ${connect.connection.host}`),
    );
    systemLogs.info(`MongoDB Connected: ${connect.connection.host}`);
  } catch (error) {
    console.error(
      chalk.red.bold(`MongoDB connection failed: ${error.message}`),
    );
    systemLogs.error(`MongoDB connection failed: ${error.message}`);
    process.exit(1);
  }
};

export default connectionToDB;
