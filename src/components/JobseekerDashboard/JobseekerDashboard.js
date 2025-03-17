import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import JobseekerProfile from "./JobseekerProfile";
import AvailableJobs from "./AvailableJobs";
import AppliedJobs from "./AppliedJobs";
import SavedJobs from "./SavedJobs";
import { jwtDecode } from "jwt-decode";
import JobseekerNotifications from "./JobseekerNotifications";
import SettingsAndHelp from "./SettingsAndHelp";
import "./JobseekerDashboard.css";
import CVForm from "./CVForm";
import JobSeekerReview from "./JobSeekerReview";

const JobseekerDashboard = () => {
  const [showSettings, setShowSettings] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showCVForm, setShowCVForm] = useState(false);
  const [jobseekerId, setJobseekerId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setJobseekerId(decodedToken.id);
        setLoading(false);
      } catch (error) {
        console.error("Error decoding token:", error);
        setLoading(false);
      }
    } else {
      console.error("Token not found.");
      setLoading(false);
    }
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!jobseekerId) {
    return <p>Jobseeker ID not found. Please log in again.</p>;
  }

  return (
    <div className="dashboard-container">
      {/* Top Section */}
      <div className="top-section">
        <JobseekerProfile />
        <JobseekerNotifications />
      </div>

      {/* Middle Section */}
      <div className="middle-section">
        <AvailableJobs />
        <AppliedJobs />
        <SavedJobs />
      </div>

      {/* CV Upgrade Section */}
      <section className="cv-upgrade-section">
        <h1>Ready to level up your CV game?</h1>
        <button className="upgrade-btn" onClick={() => setShowCVForm(true)}>
          Upgrade My CV
        </button>
      </section>

      {/* CV Form Modal */}
      {showCVForm && (
        <div className="modal-backdrop">
          <div className="modal">
            <CVForm closeCVForm={() => setShowCVForm(false)} />
          </div>
        </div>
      )}

      <JobSeekerReview jobseekerId={jobseekerId} />

      {/* Footer with Buttons */}
      <footer className="dashboard-footer">
        <button className="btn settings-btn" onClick={() => setShowSettings(true)}>
          <i className="fas fa-cog"></i> Settings
        </button>
        <button className="btn help-btn" onClick={() => setShowHelp(true)}>
          <i className="fas fa-question-circle"></i> Help
        </button>
        <Link to="/logout">
          <button className="btn logout-btn">
            <i className="fas fa-sign-out-alt"></i> Exit
          </button>
        </Link>
      </footer>

      {/* Modals for Settings and Help */}
      {showSettings && <SettingsAndHelp onClose={() => setShowSettings(false)} />}
      {showHelp && (
        <div className="help-overlay">
          <div className="help-modal">
            <button className="close-btn" onClick={() => setShowHelp(false)}>
              <i className="fas fa-times"></i>
            </button>
            <h3>Help</h3>
            <p>If you need assistance, please contact our support team.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobseekerDashboard;