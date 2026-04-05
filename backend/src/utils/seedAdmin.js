const connectDB = require("../config/db");
const env = require("../config/env");
const User = require("../models/User");

const seedAdmin = async () => {
  await connectDB();

  const existingUser = await User.findOne({ email: env.defaultAdminEmail.toLowerCase() });
  if (existingUser) {
    console.log("Admin already exists.");
    process.exit(0);
  }

  await User.create({
    name: env.defaultAdminName,
    email: env.defaultAdminEmail,
    password: env.defaultAdminPassword,
    role: "admin",
  });

  console.log(`Admin created successfully: ${env.defaultAdminEmail}`);
  process.exit(0);
};

seedAdmin().catch((error) => {
  console.error("Failed to seed admin:", error.message);
  process.exit(1);
});
