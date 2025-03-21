import React, { useState } from "react";
import { Link } from "react-router-dom";
import EmployerProfile from "./EmployerProfile.js";
import PostJob from "./PostJob.js";
import ActiveJobs from "./ActiveJobs";
import JobApplications from "./JobApplications";
import EmployerNotifications from "./EmployerNotifications";
import SettingsAndHelp from "./SettingsAndHelp";
import "./EmployerDashboard.css";

const EmployerDashboard = () => {
  const [showPostJob, setShowPostJob] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  const togglePostJob = () => setShowPostJob(!showPostJob);
  const toggleSettings = () => setShowSettings(!showSettings);
  const toggleHelp = () => setShowHelp(!showHelp);

  return (
    <div className="employer-dashboard-container">
      {/* Top Section */}
      <div className="employer-top-section">
        <EmployerProfile />
        <EmployerNotifications />
      </div>

      {/* Middle Section */}
      <div className="employer-middle-section">
        <div className="active-jobs-section">
          <ActiveJobs />
        </div>
        <div className="job-applications-section">
          <JobApplications />
        </div>

        {/* Footer Buttons */}
        <div className="employer-middle-footer">
          <button className="btn footer-btn" onClick={togglePostJob}>
            <i className="fas fa-plus-circle"></i> Post a Job
          </button>
          <button className="btn footer-btn" onClick={toggleSettings}>
            <i className="fas fa-cog"></i> Settings
          </button>
          <button className="btn footer-btn" onClick={toggleHelp}>
            <i className="fas fa-question-circle"></i> Help
          </button>
          <Link to="/logout">
            <button className="btn footer-btn logout">
              <i className="fas fa-sign-out-alt"></i> Exit
            </button>
          </Link>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="employer-bottom-section">
        {/* Add any additional content here */}
      </div>

      {/* Conditional Rendering */}
      {showPostJob && (
        <div className="modal-backdrop">
          <div className="modal">
            <PostJob onClose={togglePostJob} />
          </div>
        </div>
      )}
      {showSettings && (
        <div className="modal-backdrop">
          <div className="modal">
            <SettingsAndHelp onClose={toggleSettings} />
          </div>
        </div>
      )}
      {showHelp && (
        <div className="modal-backdrop">
          <div className="modal">
            <SettingsAndHelp onClose={toggleHelp} />
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployerDashboard;