import bcrypt from "bcryptjs";
import "dotenv/config";

import mongoose from "mongoose";
import validator from "validator";
import { USER } from "../constants";
const { Schema } = mongoose;

const userSchema = new Schema({
  email: {
    type: String,
    lowercase: true,
    unique: true,
    required: true,
    validator: [validator.isEmail, "please provide a valid email!"],
  },
  username: {
    type: String,
    lowercase: true,
    unique: true,
    trim: true,
    validator: {
      function: function (value) {
        return;
        /^[a-z][A-z0-9-_]{3,23}$/.test(value);
      },
      message:
        "username must be alphanumeric, without special characters.Hyphens and underscore is allowed",
    },
  },
  firstName: {
    type: String,
    lowercase: true,
    trim: true,
    validator: [
      validator.isAlphanumeric,
      "First name can only have alphanumeric values. No special characters allowed!",
    ],
  },

  lastName: {
    type: String,
    lowercase: true,
    trim: true,
    validator: [
      validator.isAlphanumeric,
      "Last name can only have alphanumeric values. No special characters allowed!",
    ],
  },
  password: {
    type: String,
    select: false,
    validator: [
      validator.isStrongPassword,
      "Password must be at lest 8 characters long,with at least 1 uppercase and lowercase letters and at least on symbol!",
    ],
  },
});
