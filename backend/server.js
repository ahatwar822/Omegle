const express = require('express');
require('dotenv').config();
const http = require('http');

const app = express();
const httpServer = http.createServer(app);

const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => {
    console.log('Sever is runnig on port', PORT)
})