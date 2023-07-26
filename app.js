
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.get('/', (req, res) => {
  res.send('<h1>Hello world</h1>');
});

// Socket.io connection handler
io.on('connection', (socket) => {
  console.log('a user connected');
  
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
  
  socket.on('chat message', (msg) => {
    console.log('message: ' + msg);
    
    // Broadcast message to all clients
    io.emit('chat message', msg); 
  });
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});