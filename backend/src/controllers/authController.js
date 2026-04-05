const User = require("../models/User");
const asyncHandler = require("../utils/asyncHandler");
const AppError = require("../utils/AppError");
const sendSuccess = require("../utils/apiResponse");
const { generateToken } = require("../services/tokenService");

const register = asyncHandler(async (req, res) => {
  const existingUser = await User.findOne({ email: req.body.email.toLowerCase() });
  if (existingUser) {
    throw new AppError("A user with this email already exists.", 409);
  }

  const user = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    phone: req.body.phone,
    role: req.body.role || "admin",
    preferredLanguage: req.body.preferredLanguage || "en",
  });

  const token = generateToken(user._id);

  return sendSuccess(res, 201, "User registered successfully.", {
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      preferredLanguage: user.preferredLanguage,
    },
  });
});

const login = asyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.body.email.toLowerCase() }).select("+password");

  if (!user || !(await user.comparePassword(req.body.password))) {
    throw new AppError("Invalid email or password.", 401);
  }

  if (!user.isActive) {
    throw new AppError("This account has been disabled.", 403);
  }

  const token = generateToken(user._id);

  return sendSuccess(res, 200, "Login successful.", {
    token,
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

module.exports = {
  register,
  login,
};
