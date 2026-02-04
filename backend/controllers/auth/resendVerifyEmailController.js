import asyncHandler from "express-async-handler";
import User from "../../models/userModel.js";
import sendEmail from "../../utils/sendEmail.js";
import VerificationToken from "../../models/verifyResetTokenModel.js";
const domainURL = process.env.DOMAIN;
const { randomBytes } = await import("crypto");

const resendEmailVerificationToken = asyncHandler(async (req, res) => {
  const email = req.body;
  const user = await User.findOne({ email });
  if (!email) {
    res.status(400);
    throw new Error("An email  must be  provided");
  }
  if (!user) {
    res.status(400);

    throw new Error(
      "We are unable to find the user  with start email address ",
    );
  }
  if (user.isEmailVerified) {
    res.status(400);
    throw new Error(
      "This email account has already been verified. Please login",
    );
  }

  let verificationToken = await VerificationToken.findOne({ _userId: user.id });
  if (verificationToken) {
    await VerificationToken.deleteOne();
  }
  const resendToken = randomBytes(32).toString("hex");
  let emailToken = await new VerificationToken({
    _useId: user._id,
    token: resendToken,
  }).save();
  const emailLink = `${domainURL}/api/v1/auth/verify/${emailToken.token}/user._id`;
  const payload = {
    name: user.firstName,
    email: emailLink,
  };
  await sendEmail(
    user.email,
    "Account Verification",
    payload,
    "./emails/template/accountVerification.handlebars",
  );
  res.json({
    success: true,
    message: `${user.firstName}, an email has been sent to your account, please verify with in 15 minutes`,
  });
});

export default resendEmailVerificationToken;
