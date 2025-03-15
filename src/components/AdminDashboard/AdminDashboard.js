import React, { useState } from "react";
import { FaTachometerAlt, FaUsers, FaEnvelope, FaStar, FaCog } from "react-icons/fa";
import DashboardOverview from "./DashboardOverview";
import UserManagement from "./UserManagement";
import NewsletterManagement from "./NewsletterManagement";
import ReviewsAndRatings from "./ReviewsAndRatings";
import SystemSettings from "./SystemSettings";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");

  const renderActiveTab = () => {
    switch (activeTab) {
      case "overview":
        return <DashboardOverview />;
      case "users":
        return <UserManagement />;
      case "newsletter":
        return <NewsletterManagement />;
      case "reviews":
        return <ReviewsAndRatings />;
      case "settings":
        return <SystemSettings />;
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <div className="admin-dashboard">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <h1>Admin Dashboard</h1>
        </div>
        <ul className="sidebar-menu">
          <li
            className={activeTab === "overview" ? "active" : ""}
            onClick={() => setActiveTab("overview")}
          >
            <FaTachometerAlt className="icon" />
            <span>Dashboard Overview</span>
          </li>
          <li
            className={activeTab === "users" ? "active" : ""}
            onClick={() => setActiveTab("users")}
          >
            <FaUsers className="icon" />
            <span>User Management</span>
          </li>
          <li
            className={activeTab === "newsletter" ? "active" : ""}
            onClick={() => setActiveTab("newsletter")}
          >
            <FaEnvelope className="icon" />
            <span>Newsletter Management</span>
          </li>
          <li
            className={activeTab === "reviews" ? "active" : ""}
            onClick={() => setActiveTab("reviews")}
          >
            <FaStar className="icon" />
            <span>Reviews & Ratings</span>
          </li>
          <li
            className={activeTab === "settings" ? "active" : ""}
            onClick={() => setActiveTab("settings")}
          >
            <FaCog className="icon" />
            <span>System Settings</span>
          </li>
        </ul>
      </aside>

      {/* Main Content */}
      <main className="main-content">{renderActiveTab()}</main>
    </div>
  );
};

export default AdminDashboard;