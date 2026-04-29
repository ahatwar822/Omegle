const chatEventHandler = require("./chatEventHandler");
const webRTCHandler = require("./webRTCHandler");

const connectionhandler = (io) => {
    io.on("connection", (socket) => {
        chatEventHandler(socket, io);
        webRTCHandler(socket, io);
    })
}

module.exports = connectionhandler;