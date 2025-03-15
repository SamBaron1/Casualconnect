import React, { useEffect, useState } from "react";
import "./DashboardOverview.css"; // Import the CSS file

const DashboardOverview = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalJobs: 0,
    activeUsers: 0,
    newsletterSubscribers: 0,
  });

  useEffect(() => {
    const token = localStorage.getItem("token"); // Assuming the token is stored in localStorage
    fetch("http://localhost:5000/api/admin/stats", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`, // Add the token here
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json(); // Ensure proper JSON parsing
      })
      .then((data) => {
        console.log("Stats fetched:", data); // Debugging
        setStats(data);
      })
      .catch((err) => {
        console.error("Error fetching stats:", err.message);
      });
  }, []);
  
  

  return (
    <div className="dashboard-overview">
      <h2>Dashboard Overview</h2>
      <div className="stats">
        <div className="stat">
          <h3>{stats.totalUsers}</h3>
          <p>Total Users</p>
        </div>
        <div className="stat">
          <h3>{stats.totalJobs}</h3>
          <p>Total Jobs Posted</p>
        </div>
        <div className="stat">
          <h3>{stats.activeUsers}</h3>
          <p>Active Users (Last 30 Days)</p>
        </div>
        <div className="stat">
          <h3>{stats.newsletterSubscribers}</h3>
          <p>Newsletter Subscribers</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;