const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

// create users object to store users
const users = {};

// send users object to client as a route
app.get("/users", (req, res) => {
  res.send(users);
});

// recieve the username from the client
app.post("/username", (req, res) => {
  console.log(req.query.username);
  
  res.send("Username received");
});


io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);
  // store the connected user in the users object
  socket.on("join_room", (room) => {
    users[socket.id] = room;
    console.log(`User ${socket.id} joined the channel ${room}`);
    socket.join(room);
    console.log(users)
  });


  socket.on("send_message", (data) => {
    socket.to(data.room).emit("receive_message", data);
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
  });
});



server.listen(3001, () => {
  console.log("SERVER RUNNING");
});