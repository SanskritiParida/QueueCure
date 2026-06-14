const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log("User Connected");

  socket.on("queueUpdated", (data) => {
    io.emit("queueUpdated", data);
  });

  socket.on("currentTokenUpdated", (data) => {
    io.emit("currentTokenUpdated", data);
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected");
  });
});

server.listen(3001, () => {
  console.log("Server Running on Port 3001");
});
