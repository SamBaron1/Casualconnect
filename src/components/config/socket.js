import { io } from "socket.io-client";

// Utility function to convert Base64url string to Uint8Array
function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; i++) {
    outputArray[i] = rawData.charCodeAt(i);
  }

  return outputArray;
}

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

  // Subscribe to push notifications on connection
  subscribeToPushNotifications(); // Call the subscription logic
});

socket.on("connect_error", (error) => {
  console.error("WebSocket connection error:", error.message);
});

// Listen for notifications from the server
socket.on("notification", (data) => {
  console.log("Received notification:", data);

  // Append the `isNew` property
  const newNotification = { ...data, isNew: true };

  // Dispatch a notification event to update the frontend state
  window.dispatchEvent(
    new CustomEvent("new-notification", { detail: newNotification })
  );

  // Show browser notification if permission is granted
  if (Notification.permission === "granted") {
    try {
      new Notification(newNotification.title, {
        body: newNotification.message,
        icon: "/jt3.JPG", // Add a custom icon
      });
    } catch (error) {
      console.error("Error displaying notification:", error);
    }
  }
});

socket.on("disconnect", () => {
  console.log("Disconnected from Socket.IO server");
});

// Function to subscribe to push notifications
function subscribeToPushNotifications() {
  if ("serviceWorker" in navigator && "PushManager" in window) {
    // Fetch the VAPID public key from the backend
    fetch(`${process.env.REACT_APP_API_BASE_URL}/vapidPublicKey`)
      .then((response) => response.json())
      .then(({ publicKey }) => {
        // Decode the Base64url VAPID public key to Uint8Array
        const applicationServerKey = urlBase64ToUint8Array(publicKey);

        // Subscribe to push notifications using the registered Service Worker
        navigator.serviceWorker.ready
          .then((registration) => {
            return registration.pushManager.subscribe({
              userVisibleOnly: true, // Ensures notifications are visible
              applicationServerKey, // Use decoded key here
            });
          })
          .then((subscription) => {
            console.log("Push Notification Subscription:", subscription);

            // Include user ID in the subscription payload
            const userId = localStorage.getItem("userId"); // Ensure `userId` is available
            socket.emit("subscribe", { ...subscription.toJSON(), userId });
            console.log("userId from localStorage:", userId);
          })
          .catch((error) => {
            console.error("Push subscription error:", error);
          });
      })
      .catch((error) => {
        console.error("Error fetching VAPID public key:", error);
      });
  } else {
    console.error("Push notifications are not supported in this browser.");
  }
}

export default socket;