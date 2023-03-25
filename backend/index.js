const express = require('express');
const http = require('http');
const cors = require('cors');
require('dotenv').config();

const app = express();
const { Server } = require('socket.io');

app.use(cors);

const server = http.createServer(app);
const PORT = process.env.PORT || 5000;

const io = new Server(server, {
  cors: {
    origin: 'http://127.0.0.1:5173',
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket) => {
  console.log(`user connect ${socket.id}`);

  socket.on('send_message', (data) => {
    // console.log(data);
    socket.broadcast.emit('receive_message', data);
  });
});

server.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
