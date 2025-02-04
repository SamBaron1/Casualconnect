import React, { useState} from "react";
import { Link } from "react-router-dom";
import EmployerProfile from "./EmployerProfile.js"; // Similar to ProfileSection
import PostJob from "./PostJob";
import ActiveJobs from "./ActiveJobs";
import JobApplications from "./JobApplications"; // Similar to AppliedJobs
import EmployerNotifications from "./EmployerNotifications"; // Similar to NotificationsPanel
import SettingsAndHelp from "./SettingsAndHelp";
import "./EmployerDashboard.css"; // Use similar CSS structure




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
        <ActiveJobs />
        <JobApplications />
   
      </div>

      {/* Bottom Section */}
      <div className="employer-bottom-section">
     
        
        
      </div>

      {/* Footer Section */}
      <footer className="employer-dashboard-footer">
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
          <button className="btn footer-btn">
            <i className="fas fa-sign-out-alt"></i> Logout
          </button>
        </Link>
      </footer>

      {/* Conditional Rendering */}
      {showPostJob && <PostJob onClose={togglePostJob} />}
      {showSettings && <SettingsAndHelp onClose={toggleSettings} />}
      {showHelp && <SettingsAndHelp onClose={toggleHelp} />}
    </div>
  );
};

export default EmployerDashboard;
