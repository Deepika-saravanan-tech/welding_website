const User = require("../models/User");
const env = require("../config/env");

const seedDefaultAdmin = async () => {
  if (!env.defaultAdminEmail || !env.defaultAdminPassword) {
    return;
  }

  const existingAdmin = await User.findOne({ email: env.defaultAdminEmail.toLowerCase() });
  if (existingAdmin) {
    return;
  }

  await User.create({
    name: env.defaultAdminName,
    email: env.defaultAdminEmail,
    password: env.defaultAdminPassword,
    role: "admin",
  });

  console.log(`Default admin created: ${env.defaultAdminEmail}`);
};

module.exports = seedDefaultAdmin;
