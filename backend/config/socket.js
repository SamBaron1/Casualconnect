const socketIo = require("socket.io");
const webPush = require("web-push");
const PushSubscription = require("../models/pushSubscription"); // Import PushSubscription model

let io;

// Initialize VAPID keys for web-push
webPush.setVapidDetails(
  "mailto:samuelng0001@gmail.com",
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);


const initializeSocket = (server) => {
  const corsOrigins = process.env.CORS_ORIGINS
    ? process.env.CORS_ORIGINS.split(",") // Split by commas to create an array
    : ["http://localhost:3000"]; // Default origin if not set

  io = socketIo(server, {
    cors: {
      origin: corsOrigins, // Pass the array of allowed origins
      methods: ["GET", "POST"],
      credentials: true,
    },
  });



  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    // Store push subscription from frontend
    socket.on("subscribe", async (subscription) => {
  console.log(`Push subscription received from user ${socket.id}:`, subscription);

  try {
    const userId = subscription.userId;
    if (!userId || !subscription.endpoint || !subscription.keys) {
      throw new Error("Missing required subscription fields.");
    }

    await PushSubscription.upsert({
      userId: userId,
      endpoint: subscription.endpoint,
      publicKey: subscription.keys.p256dh,
      authKey: subscription.keys.auth,
    });

    console.log("Push subscription stored successfully.");
  } catch (error) {
    console.error("Error storing push subscription:", error.message);
  }
});

    // Handle user joining a room
    socket.on("joinRoom", (room) => {
      socket.join(room);
      console.log(`User joined room: ${room}`);
    });

    // Handle user leaving a room
    socket.on("leaveRoom", (room) => {
      socket.leave(room);
      console.log(`User left room: ${room}`);
    });

    // Handle user disconnect
    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });

  return io;
};

// Function to send push notifications using web-push
const sendPushNotification = async (userId, payload) => {
  try {
    // Fetch the user's push subscription from the database
    const subscription = await PushSubscription.findOne({ where: { userId } });
    if (!subscription) {
      console.warn(`No push subscription found for user ID: ${userId}`);
      return;
    }

    // Send push notification
    await webPush.sendNotification({
      endpoint: subscription.endpoint,
      keys: {
        p256dh: subscription.publicKey,
        auth: subscription.authKey,
      },
    }, JSON.stringify(payload));
    console.log("Push notification sent successfully.");
  } catch (error) {
    console.error("Error sending push notification:", error);
  }
};

// Function to send real-time notifications via Socket.IO and push notifications
const sendNotification = async (userId, notification) => {
  if (!io) {
    console.error("Socket.IO instance is not initialized!");
    return;
  }

  // Send realtime notification
  io.to(`user_${userId}`).emit("notification", notification);

  // Send push notification
  await sendPushNotification(userId, notification); // Include push notification logic
};

module.exports = { initializeSocket, sendNotification };