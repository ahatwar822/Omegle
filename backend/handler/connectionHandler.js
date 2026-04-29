const chatEventHandler = require("./chatEventHandler");
const webRTCHandler = require("./webRTCHandler");

const connectionhandler = (io) => {
    io.on("connection", (scoket) => {
        chatEventHandler(scoket, io);
        webRTCHandler(scoket, io);
    })
}

module.exports = connectionhandler;