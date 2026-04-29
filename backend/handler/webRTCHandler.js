const webRTCHandler = (socket, io) => {

    socket.on("offer", (data) => {
        try {
            const { targetId, offer } = data;
            if (!targetId || !offer) return;

            io.to(targetId).emit("offer", {
                offer,
                sender: socket.id
            });
        } catch (err) {
            console.error("Offer error:", err.message);
        }
    });

    socket.on("answer", (data) => {
        try {
            const { targetId, answer } = data;
            if (!targetId || !answer) return;

            io.to(targetId).emit("answer", {
                answer,
                sender: socket.id
            });
        } catch (err) {
            console.error("Answer error:", err.message);
        }
    });

    socket.on("ice-candidate", (data) => {
        try {
            const { targetId, candidate } = data;
            if (!targetId || !candidate) return;

            io.to(targetId).emit("ice-candidate", {
                candidate,
                sender: socket.id
            });
        } catch (err) {
            console.error("ICE error:", err.message);
        }
    });
};

module.exports = webRTCHandler;