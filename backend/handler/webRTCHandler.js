const webRTCHandler = (socket, io, getPartner) => {

    socket.on("offer", (data) => {
        const partnerId = getPartner(socket.id);
        if (!partnerId) return;

        io.to(partnerId).emit("offer", {
            offer: data.offer,
            sender: socket.id
        });
    });

    socket.on("answer", (data) => {
        const partnerId = getPartner(socket.id);
        if (!partnerId) return;

        io.to(partnerId).emit("answer", {
            answer: data.answer,
            sender: socket.id
        });
    });

    socket.on("ice-candidate", (data) => {
        const partnerId = getPartner(socket.id);
        if (!partnerId) return;

        io.to(partnerId).emit("ice-candidate", {
            candidate: data.candidate,
            sender: socket.id
        });
    });
};

module.exports = webRTCHandler;