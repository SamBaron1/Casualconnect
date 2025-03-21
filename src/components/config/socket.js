import { io } from "socket.io-client";

// Initialize the socket connection
const socket = io("http://localhost:5000", {
  transports: ["websocket"], // Use WebSocket transport directly
  withCredentials: true,     // Include credentials for cross-origin requests
  reconnectionAttempts: 5,   // Attempt to reconnect 5 times
  reconnectionDelay: 1000,   // 1-second delay between retries
});

// Handle socket events
socket.on("connect", () => {
  console.log(`Connected to Socket.IO server with ID: ${socket.id}`);
  subscribeToPushNotifications();
});

socket.on("connect_error", (error) => {
  console.error("WebSocket connection error:", error.message);
});

socket.on("notification", (data) => {
  console.log("Received notification:", data);
});

socket.on("disconnect", () => {
  console.log("Disconnected from Socket.IO server");
});

// Function to subscribe to push notifications
function subscribeToPushNotifications() {
  if ("serviceWorker" in navigator && "PushManager" in window) {
    navigator.serviceWorker.ready
      .then((registration) => {
        // Subscribe to push notifications
        registration.pushManager.subscribe({
          userVisibleOnly: true, // Ensures notifications are visible
          applicationServerKey: "<Your-VAPID-Public-Key>", // Replace with VAPID public key
        }).then((subscription) => {
          console.log("Push Notification Subscription:", subscription);

          // Send the subscription to the backend
          socket.emit("subscribe", subscription);
        }).catch((error) => {
          console.error("Push subscription error:", error);
        });
      })
      .catch((error) => {
        console.error("Service Worker not ready:", error);
      });
  } else {
    console.error("Push notifications are not supported in this browser.");
  }
}

export default socket;