const express = require('express');
const app = express();
const cors = require('cors');

const http = require('http');
const chat = require('./chat');
const socketio = require('socket.io');
const server = http.createServer(app);
app.use(cors());
const io = socketio(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});
chat(io);
