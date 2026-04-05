let io;

const initializeSocket = (server) => {
  io = require("socket.io")(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    },
  });

  io.on("connection", (socket) => {
    socket.on("disconnect", () => {});
  });

  return io;
};

const getIO = () => io;

module.exports = {
  initializeSocket,
  getIO,
};
