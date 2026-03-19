const express = require('express');
require('dotenv').config();
const http = require('http');
const {Server} = require('socket.io');

const app = express();
const httpServer = http.createServer(app);

const io = new Server(httpServer, {
    cors:{
        origin: "http://localhost:5173",
        methods: ["GET", "POST"] 
    }
})

app.get('/', (req, res) => {
    res.send('hello world')
})

io.on('connection', (socket) => {
    console.log('a user/client connected', socket.id)
    socket.on('sender', (senderData) =>{
        const {targetId, message} = senderData;
        console.log(targetId, message)

        io.to(targetId).emit('receiver', {
            sernder: socket.id,
            message
        })


    })
})

const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => {
    console.log('Sever is runnig on port', PORT)
})