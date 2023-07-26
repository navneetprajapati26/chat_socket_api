import express from "express";
const app = express();
import { createServer } from "http";
const server = createServer(app);
import { Server } from "socket.io";
const io = new Server(server);

// Keep track of user names and their corresponding sockets
const users = {};

app.get("/", (req, res) => {
  res.send("<h1>Hello world</h1>");
});

// Socket.io connection handler
io.on("connection", (socket) => {
  console.log("a user connected");

  // Handle user login and store the username and socket
  socket.on("login", (username) => {
    users[socket.id] = username;
    console.log(`${username} logged in.`);
  });

  socket.on("disconnect", () => {
    const username = users[socket.id];
    if (username) {
      console.log(`${username} disconnected`);
      delete users[socket.id];
    }
  });

  socket.on("chat message", (msg) => {
    const username = users[socket.id];
    if (username) {
      console.log(`${username} says: ${msg}`);
      // Broadcast message to all clients along with the username
      io.emit("chat message", { username, msg });
    }
  });
});

const port = process.env.PORT || 5000;

server.listen(port, () => {
  console.log(`listening on ${port}`);
});
