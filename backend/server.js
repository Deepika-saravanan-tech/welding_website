const http = require("http");
const app = require("./src/app");
const env = require("./src/config/env");
const connectDB = require("./src/config/db");
const { initializeSocket } = require("./src/config/socket");

const startServer = async () => {
  await connectDB();

  const server = http.createServer(app);
  initializeSocket(server);

  server.listen(env.port, () => {
    console.log(`Server running on port ${env.port} in ${env.nodeEnv} mode`);
  });
};

startServer().catch((error) => {
  console.error("Failed to start server:", error.message);
  process.exit(1);
});
