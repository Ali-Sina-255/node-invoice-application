import "dotenv/config";
import fs from "fs";
import Handlebars from "handlebars";
import path from "path";
import { fileURLToPath } from "url";
import transporter from "../helpers/emailTransport.js";
// import emailTransport from "../helpers/emailTransport.js";/

import { systemLogs } from "./Logger.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sendEmail = async (email, subject, payload, template) => {
  const sourceDirectory = fs.readFileSync(
    path.join(__dirname, template, "utf-8"),
  );
  const compiledTemplate = Handlebars.compile(sourceDirectory);
  const emailOptional = {
    from: process.env.SENDER_EMAIL,
    subject: subject,
    html: compiledTemplate(payload),
  };
  await transporter.sendMail(emailOptional);
  try {
  } catch (error) {
    systemLogs.error(`Email not send ${email}`);
  }
};

export default sendEmail;
