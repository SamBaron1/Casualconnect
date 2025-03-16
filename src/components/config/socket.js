import { io } from "socket.io-client";

// Configure Socket.IO connection globally
const socket = io("http://localhost:5000", {
  transports: ['websocket', 'polling'],
  withCredentials: true,
  reconnectionAttempts: 5, // Limit reconnection attempts
  reconnectionDelay: 1000, // Delay between retries
});

socket.on("connect", () => {
  console.log(`Connected to Socket.IO server with ID: ${socket.id}`);
});

socket.on("notification", (data) => {
  console.log("Received notification:", data);
});

socket.on("disconnect", () => {
  console.log("Disconnected from Socket.IO server");
});

export default socket;
