const waitingQueue = [];

const activePairs = new Map(); // socketId -> partnerId

const addToQueue = (socket) => {
    console.log("User added to queue:", socket.id);

    if (waitingQueue.length > 0) {
        const partner = waitingQueue.shift();

        // pair both users
        activePairs.set(socket.id, partner.id);
        activePairs.set(partner.id, socket.id);

        console.log("Matched:", socket.id, "<->", partner.id);

        return {
            matched: true,
            partner1: socket,
            partner2: partner
        };
    }

    waitingQueue.push(socket);

    return { matched: false };
};

const removeFromQueue = (socketId) => {
    const index = waitingQueue.findIndex(s => s.id === socketId);
    if (index !== -1) {
        waitingQueue.splice(index, 1);
    }
};

const getPartner = (socketId) => {
    return activePairs.get(socketId);
};

const removePair = (socketId) => {
    const partnerId = activePairs.get(socketId);

    if (partnerId) {
        activePairs.delete(socketId);
        activePairs.delete(partnerId);
    }

    return partnerId;
};

module.exports = {
    addToQueue,
    removeFromQueue,
    getPartner,
    removePair
};