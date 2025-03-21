const socketIo = require("socket.io");
const webPush = require("web-push");

let io; // Declare Socket.IO globally
const subscriptions = new Map(); // Store push subscriptions (userId -> subscription)

// Initialize VAPID keys for web-push
webPush.setVapidDetails(
  "mailto:samuelng0001@gmail.com", // Replace with your email
  process.env.VAPID_PUBLIC_KEY,   // Add this to your .env
  process.env.VAPID_PRIVATE_KEY   // Add this to your .env
);

const initializeSocket = (server) => {
  io = socketIo(server, {
    cors: {
      origin: "http://localhost:3000", // Frontend origin
      methods: ["GET", "POST"],        // Allowed HTTP methods
      credentials: true,               // Allow credentials (cookies, headers, etc.)
    },
  });

  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    // Store push subscription sent by the frontend
    socket.on("subscribe", (subscription) => {
      console.log(`Push subscription received from user ${socket.id}:`, subscription);

      // Store subscription in memory (you can save it to a database if needed)
      subscriptions.set(socket.id, subscription);

      // Send a test notification
      const payload = JSON.stringify({
        title: "Welcome!",
        message: "Thanks for subscribing to notifications.",
      });
      sendPushNotification(subscription, payload);
    });

    // User joins a room
    socket.on("joinRoom", (room) => {
      socket.join(room);
      console.log(`User joined room: ${room}`);
      socket.emit("notification", { message: "This is a test notification!" });
    });

    // User leaves a room
    socket.on("leaveRoom", (room) => {
      socket.leave(room);
      console.log(`User left room: ${room}`);
    });

    // Handle user disconnect
    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.id}`);

      // Remove subscription when user disconnects
      subscriptions.delete(socket.id);
    });
  });

  return io;
};

// Function to send push notifications using web-push
const sendPushNotification = (subscription, payload) => {
  webPush
    .sendNotification(subscription, payload)
    .then(() => console.log("Push notification sent successfully."))
    .catch((error) => console.error("Error sending push notification:", error));
};

// Function to send real-time notifications via Socket.IO
const sendNotification = (userId, notification) => {
  if (!io) {
    console.error("Socket.IO instance is not initialized!");
    return;
  }

  console.log(`Sending notification to user_${userId}:`, notification);
  io.to(`user_${userId}`).emit("notification", notification);
};

module.exports = { initializeSocket, sendNotification };