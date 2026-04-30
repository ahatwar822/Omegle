const chatEventHandler = require("./chatEventHandler");
const webRTCHandler = require("./webRTCHandler");
const {
    addToQueue,
    removeFromQueue,
    getPartner,
    removePair
} = require("../utils/matchmaking");

const connectionhandler = (io) => {
    io.on("connection", (socket) => {
        console.log("User connected:", socket.id);

        // JOIN QUEUE
        socket.on("join", () => {
            const result = addToQueue(socket);

            if (result.matched) {
                const { partner1, partner2 } = result;

                // Notify both users
                io.to(partner1.id).emit("matched", {
                    partnerId: partner2.id
                });

                io.to(partner2.id).emit("matched", {
                    partnerId: partner1.id
                });
            } else {
                socket.emit("waiting");
            }
        });

        // CHAT + WEBRTC HANDLERS
        chatEventHandler(socket, io, getPartner);
        webRTCHandler(socket, io, getPartner);

        //  NEXT USER
        socket.on("next", () => {
            const partnerId = removePair(socket.id);

            if (partnerId) {
                io.to(partnerId).emit("partner-disconnected");
                addToQueue(io.sockets.sockets.get(partnerId));
            }

            const result = addToQueue(socket);

            if (result.matched) {
                const { partner1, partner2 } = result;

                io.to(partner1.id).emit("matched", {
                    partnerId: partner2.id
                });

                io.to(partner2.id).emit("matched", {
                    partnerId: partner1.id
                });
            } else {
                socket.emit("waiting");
            }
        });

        //  DISCONNECT
        socket.on("disconnect", () => {
            console.log("User disconnected:", socket.id);

            removeFromQueue(socket.id);

            const partnerId = removePair(socket.id);

            if (partnerId) {
                io.to(partnerId).emit("partner-disconnected");

                const partnerSocket = io.sockets.sockets.get(partnerId);
                if (partnerSocket) {
                    addToQueue(partnerSocket);
                }
            }
        });
    });
};

module.exports = connectionhandler;