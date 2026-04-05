const { getIO } = require("../config/socket");

const emitSocketEvent = (eventName, payload) => {
  const io = getIO();
  if (io) {
    io.emit(eventName, payload);
  }
};

module.exports = {
  emitSocketEvent,
};
