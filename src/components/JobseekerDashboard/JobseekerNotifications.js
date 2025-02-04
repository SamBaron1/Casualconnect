import React, { useEffect, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import "./JobseekerNotifications.css";

const socket = io("http://localhost:5000", {
  withCredentials: true,
  transports: ["websocket"],
});

const JobseekerNotifications = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const userId = localStorage.getItem("userId");
        if (!userId) {
          console.error("User ID not found in localStorage");
          return;
        }

        const response = await axios.get(`http://localhost:5000/api/notifications/${userId}`);
        setNotifications(response.data);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications(); // Initial fetch

    const userId = localStorage.getItem("userId");
    if (userId) {
      console.log(`Joining room: user_${userId}`);
      socket.emit("joinRoom", `user_${userId}`);

      socket.on("notification", (notification) => {
        console.log("New notification received:", notification);
        setNotifications((prev) => [notification, ...prev]);
      });

      return () => {
        console.log("Cleaning up Socket.IO listeners");
        socket.off("notification");
        socket.emit("leaveRoom", `user_${userId}`);
      };
    }
  }, []); // Empty dependency array ensures this runs only once
  const handleDeleteNotification = async (notificationId) => {
    try {
      await axios.delete(`http://localhost:5000/api/notifications/${notificationId}`);
      setNotifications(notifications.filter((n) => n.id !== notificationId)); // Remove from UI
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  const handleDeleteAllNotifications = async () => {
    const userId = localStorage.getItem("userId"); // Ensure userId is retrieved inside the function
    if (!userId) {
      console.error("User ID not found in localStorage");
      return;
    }
  
    try {
      await axios.delete(`http://localhost:5000/api/notifications/user/${userId}`);
      setNotifications([]); // Clear all notifications from UI
    } catch (error) {
      console.error("Error deleting all notifications:", error);
    }
  };
  

  return (
    <div className="notifications-container">
      <h3>📩Notifications</h3>
      <button onClick={handleDeleteAllNotifications} className="delete-all-btn">Delete All</button>🗑
      {notifications.length > 0 ? (
        notifications.map((note, index) => (
          <div key={index} className="notification-item">
            <p>{note.message}</p>
            <small>{new Date(note.createdAt).toLocaleString()}</small>
            <button onClick={() => handleDeleteNotification(note.id)}>Delete</button>🗑
          </div>
        ))
      ) : (
        <p>No new notifications</p>
      )}
    </div>
  );
};

export default JobseekerNotifications;
