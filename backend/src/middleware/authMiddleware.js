const jwt = require("jsonwebtoken");
const User = require("../models/User");
const env = require("../config/env");
const asyncHandler = require("../utils/asyncHandler");
const AppError = require("../utils/AppError");

module.exports = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new AppError("Access denied. Please log in first.", 401);
  }

  // The token comes from the frontend after a successful login.
  const token = authHeader.split(" ")[1];
  const decoded = jwt.verify(token, env.jwtSecret);
  const user = await User.findById(decoded.id).select("-password");

  if (!user) {
    throw new AppError("User not found for this token.", 401);
  }

  req.user = user;
  next();
});
