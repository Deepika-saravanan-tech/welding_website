const mongoose = require("mongoose");
const env = require("./env");
const seedDefaultAdmin = require("../services/bootstrapService");

const connectDB = async () => {
  if (!env.mongoUri) {
    throw new Error("MONGODB_URI is missing in the .env file.");
  }

  await mongoose.connect(env.mongoUri);
  console.log("MongoDB connected successfully");
  await seedDefaultAdmin();
};

module.exports = connectDB;
