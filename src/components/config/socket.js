import { io } from "socket.io-client";

const socket = io("http://localhost:5000", {
  transports: ["websocket"], // Use WebSocket transport directly
  withCredentials: true,     // Include credentials for cross-origin requests
  reconnectionAttempts: 5,   // Attempt to reconnect 5 times
  reconnectionDelay: 1000,   // 1-second delay between retries
});

socket.on("connect", () => {
  console.log(`Connected to Socket.IO server with ID: ${socket.id}`);
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

export default socket;
