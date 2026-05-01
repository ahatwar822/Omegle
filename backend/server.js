const express = require('express');
require('dotenv').config();
const http = require('http');
const { Server } = require('socket.io');
const config = require('./config/config');
const connectionhandler = require('./handler/connectionHandler');

const app = express();
const httpServer = http.createServer(app);

const io = new Server(httpServer, {
    cors: {
        origin: config.CORS_ORIGIN,
        methods: config.CORS_METHODS
    }
})

app.get('/', (req, res) => {
    res.send('server is running...');
})

connectionhandler(io);

const PORT = config.PORT;

httpServer.listen(PORT, () => {
    console.log('Sever is runnig on port', PORT)
})