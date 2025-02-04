import React, { useState } from "react";
import Notifications from "./Notifications";
import JobFeed from "./JobFeed";
import ProfileOverview from "./ProfileOverview";
import MessagesPreview from "./MessagesPreview";
import "./JobseekerDashboard.css";

const JobseekerDashboard = () => {
  const [notifications, setNotifications] = useState([
    "New job posted: Software Developer",
    "Your application for Driver was viewed",
    "Employer responded to your application",
  ]);

  const [jobFeed, setJobFeed] = useState([
    { id: 1, title: "Web Developer", location: "Nairobi", salary: "50k-70k" },
    { id: 2, title: "Graphic Designer", location: "Mombasa", salary: "30k-40k" },
    { id: 3, title: "Digital Marketer", location: "Kisumu", salary: "40k-60k" },
  ]);

  return (
    <div className="dashboard-container">
      {/* Header Section */}
      <header className="dashboard-header">
        <h1>Welcome, Jobseeker!</h1>
        <div className="header-actions">
          <button className="action-btn">Notifications</button>
          <button className="action-btn">Messages</button>
          <button className="action-btn">Settings</button>
        </div>
      </header>

      {/* Main Dashboard Layout */}
      <div className="dashboard-body">
        {/* Left Sidebar - Profile Overview */}
        <aside className="left-sidebar">
          <ProfileOverview />
        </aside>

        {/* Central Panel - Job Feed */}
        <main className="main-panel">
          <JobFeed jobs={jobFeed} />
        </main>

        {/* Right Sidebar - Notifications and Messages */}
        <aside className="right-sidebar">
          <Notifications notifications={notifications} />
          <MessagesPreview />
        </aside>
      </div>
    </div>
  );
};

export default JobseekerDashboard;
