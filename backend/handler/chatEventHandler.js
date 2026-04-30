const chatEventHandler = (socket, io, getPartner) => {
    socket.on("sender", (data) => {
        const partnerId = getPartner(socket.id);
        if (!partnerId) return;

        io.to(partnerId).emit("receiver", {
            message: data.message,
            sender: socket.id
        });
    });
};

module.exports = chatEventHandler;