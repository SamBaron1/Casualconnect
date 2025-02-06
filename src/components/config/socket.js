import { io } from "socket.io-client";

const SOCKET_IO_URL = process.env.REACT_APP_SOCKET_IO_URL;
const socket = io(SOCKET_IO_URL, {
  transports: ['websocket', 'polling'], // Ensure correct transport methods
  reconnection: true, // Enable reconnection
  reconnectionAttempts: Infinity, // Number of reconnection attempts
  reconnectionDelay: 1000, // Delay between reconnections
  reconnectionDelayMax: 5000, // Maximum delay between reconnections
});

// Event listener for connection success
socket.on("connect", () => {
  console.log(`Connected to Socket.IO server with ID: ${socket.id}`);
});

// Event listener for disconnection
socket.on("disconnect", () => {
  console.log("Disconnected from Socket.IO server");
});

// Export the socket instance for use in other files
export default socket;
