const express = require('express');
const app = express();
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const needRoutes = require("./routes/needRoutes");
const messageRoutes=require("./routes/messageRoutes")

const connectDB = require("./config/db");

connectDB();
app.use(express.json());
app.use('/api/user', userRoutes);
app.use("/api/chat", chatRoutes);
app.use('/api/need', needRoutes);
app.use('/api/message',messageRoutes)

const server = app.listen("5000", () => {
  console.log("running");
});

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:3000",
    // credentials: true,
  },
});

const activeRooms = {}; // Keep track of active rooms

io.on("connection", (socket) => {
  socket.on("join_room", (data) => {
    console.log(`User Connected: ${data}`);
    if (socket.room) {
      // Leave the previous room if already joined
      socket.leave(socket.room);
    }
    socket.join(data);
    socket.room = data; // Update the current room
    activeRooms[data] = true; // Mark the room as active
  });

  socket.on("send_message", (obj) => {
    socket.to(obj.selectedChatId).emit("receive_message", obj.data);
  });

  socket.on("leave_room",()=>{
    if (socket.room && activeRooms[socket.room]) {
      // Leave the room and remove it from activeRooms
      socket.leave(socket.room);
      delete activeRooms[socket.room];
    }
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected");
    if (socket.room && activeRooms[socket.room]) {
      // Leave the room and remove it from activeRooms
      socket.leave(socket.room);
      delete activeRooms[socket.room];
    }
  });
});
