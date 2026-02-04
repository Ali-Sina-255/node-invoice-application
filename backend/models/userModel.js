import bcrypt from "bcryptjs";
import "dotenv/config";

import mongoose from "mongoose";
import validator from "validator";

import { USER } from "../constants/index.js";

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    email: {
      type: String,
      unique: true,
      required: true,
      validator: [validator.isEmail, "please provide a valid email!"],
    },
    username: {
      type: String,
      required: true,
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
      required: true,
      trim: true,
      validator: [
        validator.isAlphanumeric,
        "First name can only have alphanumeric values. No special characters allowed!",
      ],
    },

    lastName: {
      type: String,
      required: true,
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
    passwordConfirm: {
      type: String,
      validator: {
        validator: function (value) {
          return value === this.password;
        },
        message: "Password do not match!",
      },
    },
    isEmailVerified: { type: Boolean, required: true, default: false },
    provider: {
      type: String,
      required: true,
      default: "email",
    },
    googleID: String,
    avatar: String,
    businessName: String,
    phoneNumber: {
      type: String,
      default: "+93777777777",
      validator: [
        validator.isMobilePhone,
        "Your mobile phone number must begin with '+', followed by your country code then actual number",
      ],
    },
    address: String,
    city: String,
    country: String,
    passwordChangedAT: Date,

    roles: {
      type: [String],
      default: [USER],
    },
    active: {
      type: Boolean,
      default: true,
    },
    refreshToken: [String],
  },
  { timestamps: true },
);

userSchema.pre("save", async function (next) {
  if (this.roles.length === 0) {
    this.roles.push(USER);
    next();
  }
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  const salt = await bcrypt.getSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  this.passwordConfirm = undefined;
  next();
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password") || this.isNew) {
    return next();
  }
  this.passwordChangedAT = Date.now();
  next();
});

userSchema.methods.comparePassword = async function (givenPassword) {
  return await bcrypt.compare(givenPassword, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;
