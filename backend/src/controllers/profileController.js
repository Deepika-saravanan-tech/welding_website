const User = require("../models/User");
const asyncHandler = require("../utils/asyncHandler");
const AppError = require("../utils/AppError");
const sendSuccess = require("../utils/apiResponse");

const getProfile = asyncHandler(async (req, res) => {
  return sendSuccess(res, 200, "Profile fetched successfully.", {
    user: req.user,
  });
});

const updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    throw new AppError("User not found.", 404);
  }

  ["name", "phone", "preferredLanguage"].forEach((field) => {
    if (req.body[field] !== undefined) {
      user[field] = req.body[field];
    }
  });

  if (req.body.email && req.body.email !== user.email) {
    const emailExists = await User.findOne({
      email: req.body.email.toLowerCase(),
      _id: { $ne: user._id },
    });

    if (emailExists) {
      throw new AppError("This email is already being used by another account.", 409);
    }

    user.email = req.body.email;
  }

  await user.save();

  return sendSuccess(res, 200, "Profile updated successfully.", {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      preferredLanguage: user.preferredLanguage,
    },
  });
});

const changePassword = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("+password");
  if (!user) {
    throw new AppError("User not found.", 404);
  }

  const isCurrentPasswordCorrect = await user.comparePassword(req.body.currentPassword);
  if (!isCurrentPasswordCorrect) {
    throw new AppError("Current password is incorrect.", 400);
  }

  user.password = req.body.newPassword;
  await user.save();

  return sendSuccess(res, 200, "Password updated successfully.");
});

module.exports = {
  getProfile,
  updateProfile,
  changePassword,
};
