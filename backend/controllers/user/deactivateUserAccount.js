import asyncHandler from "express-async-handler";

import User from "../../models/userModel.js";

const deactivateUserAccount = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (user) {
    user.active = false;
    const updateUser = await user.save();
    res.json({ success: true, updateUser });
  } else {
    res.status(404);
    throw new Error("User  was not found");
  }
});

export default deactivateUserAccount;
