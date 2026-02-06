import asyncHandler from "express-async-handler";

import User from "../../models/userModel.js";

import VerificationToken from "../../models/verifyResetTokenModel.js";
import sendEmail from "../../utils/sendEmail.js";

const domainURL = process.env.DOMAIN;
const { randomBytes } = await import("crypto");

const resetPasswordRequest = asyncHandler(async (req, res) => {
  const email = req.body;
  if (!email) {
    res.status(400);
    throw new Error("You  must enter your email address");
  }
  const existingUser = await User.findOne({ email }).select("-passwordConfirm");
  if (!existingUser) {
    res.status(400);
    throw new Error("That email is not associated with any account");
  }

  let verificationToke = await VerificationToken.findOne({
    _userId: existingUser._id,
  });
  if (verificationToke) {
    await verificationToke.deleteOne();
  }

  const resetToken = randomBytes(32).toString("hex");

  let newVerificationToken = await new VerificationToken({
    _userId: existingUser._id,
    token: resetToken,
    createAt: Date.now(),
  }).save();

  if (existingUser && existingUser.isEmailVerified) {
    const emailLink = `${domainURL}/auth/reset_password?emailToken=${newVerificationToken.token}&userId=${existingUser._id}`;
    const payload = {
      name: existingUser.firstName,
      email: emailLink,
    };
    await sendEmail(
      existingUser.email,
      "Password Reset Request",
      payload,
      "./emails/template/requestRestPassword.handlebars",
    );

    res.status(200).json({
      success: true,
      message: `Hey, ${existingUser.firstName}, an email has been sent to your account with the password reset link`,
    });
  }
});

const resetPassword = asyncHandler(async (req, res) => {
  const { password, passwordConfirm, userId, emailToken } = req.body;
  if (!password) {
    res.status(400);
    throw new Error("A password is required");
  }
  if (!passwordConfirm) {
    res.status(400);
    throw new Error("A confirm password field is required");
  }
  if (password !== passwordConfirm) {
    res.status(400);
    throw new Error("Password do not match");
  }
  if (password.length < 8) {
    res.status(400);
    throw new Error("Password  must be at least 8 characters long ");
  }

  const passwordResetToken = await VerificationToken.findOne({ userId });
  if (!passwordResetToken) {
    res.status(400);
    throw new Error(
      "Your token is either invalid or expired. Try  resetting your  password again",
    );
  }

  const user = await User.findById({ _id: passwordResetToken._id }).selected(
    "-passwordConfirm",
  );
  if (user && passwordResetToken) {
    user.password = password;
    await user.save();
    const payload = {
      name: user.firstName,
    };
    await sendEmail(
      user.email,
      "Password Reset Success ",
      payload,
      "./emails/resetPassword.handlebars",
    );

    res.json({
      success: true,
      message: `Hey, ${user.firstName} your password reset was successful. an email have been send to confirm the same`,
    });
  }
});

export { resetPasswordRequest, resetPassword };
