const socketIo = require("socket.io");

let io; // Declare Socket.IO globally

const initializeSocket = (server) => {
  io = socketIo(server, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on("joinRoom", (room) => {
      socket.join(room);
      console.log(`User joined room: ${room}`);
    socket.emit('notification', { message: 'This is a test notification!' });
    });

    socket.on("leaveRoom", (room) => {
      socket.leave(room);
      console.log(`User left room: ${room}`);
    });

    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });

  return io;
};

// Function to send real-time notifications
const sendNotification = (userId, notification) => {
  if (!io) {
    console.error("Socket.IO instance is not initialized!");
    return;
  }

  console.log(`Sending notification to user_${userId}:`, notification);
  io.to(`user_${userId}`).emit("notification", notification);
};

module.exports = { initializeSocket, sendNotification };
