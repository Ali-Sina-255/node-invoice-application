import asyncHandler from "express-async-handler";

import User from "../../models/userModel.js";

const updateUserProfile = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const {
    password,
    passwordConfirm,
    email,
    isEmailVerified,
    provider,
    roles,
    googleID,
    userName,
  } = req.body;

  const user = await User.findById(userId);
  if (!user) {
    res.status(400);
    throw new Error("That user  does not exist in your system");
  }
  if (!password || passwordConfirm) {
    res.status(400);
    throw new Error(
      "This route is not for password update. please use the password, reset functionality instated",
    );
  }
  if (email || isEmailVerified || provider || roles || googleID) {
    res.status(400);

    throw new Error("You are not allowed to update that field on this route");
  }

  const fieldToUpdate = req.body;
  const updateProfile = await User.findByIdAndUpdate(
    userId,
    { ...fieldToUpdate },
    { new: true, runValidators: true },
  ).select("-refreshToken");

  res.status(200).json({
    success: true,
    message: `${user.firstName}, your profile  was successfully update`,
    updateProfile,
  });
});

export default updateUserProfile;
