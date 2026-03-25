const express = require('express');
require('dotenv').config();
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const httpServer = http.createServer(app);

const io = new Server(httpServer, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"]
    }
})

app.get('/', (req, res) => {
    res.send('hello world')
})

io.on('connection', (socket) => {
    console.log('a user/client connected', socket.id)

    socket.on('sender', (senderData) => {
        const { targetId, message } = senderData;
        console.log(targetId, message)

        io.to(targetId).emit('receiver', {
            sernder: socket.id,
            message
        })
    })
})

// Offer ko ek client se dusre client tak forward karna
// Client A offer bhejta hai, hum use Client B tak forward karte hain

socket.on('offer', (data) => {
    console.log("Offer received from:", socket.id, "forwarding to:", data.targetId)
    // Target client ko offer forward karo with sender info
    io.to(data.targetId).emit('offer', {
        offer: data.offer,
        sender: socket.id

    })
})

// Answer ko ek client se dusre client tak forward karna
// Client B answer bhejta hai, hum use Client A tak forward karte hain
socket.on('answer', (data) => {
    console.log("Answer received from:", socket.id, "forwarding to:", data.targetId)
    // Target client ko answer forward karo with sender info
    io.to(data.targetId).emit('answer', {
        answer: data.answer,
        sender: socket.id
    })
})


// ICE candidate ko ek client se dusre client tak forward karna
// Jab ek client apna ICE candidate bhejta hai, hum use target client tak forward karte hain
socket.on('ice-candidate', (data) => {
    console.log("ICE candidate received from:", socket.id, "forwarding to:", data.targetId)
    // Target client ko ICE candidate forward karo with sender info
    io.to(data.targetId).emit('ice-candidate', {
        candidate: data.candidate,
        sender: socket.id
    })
})

const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => {
    console.log('Sever is runnig on port', PORT)
})