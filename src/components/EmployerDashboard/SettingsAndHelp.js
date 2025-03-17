import React, { useState, useEffect } from "react";
import "./SettingsAndHelp.css";

const SettingsAndHelp = ({ onClose }) => {
  // Load dark mode setting from localStorage
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("darkMode") === "true"
  );

  // Handle dark mode toggle
  const handleDarkModeToggle = () => {
    setDarkMode(!darkMode);
  };

  // Apply dark mode to the body
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  // Redirect to email for support
  const redirectToEmail = () => {
    window.location.href = "mailto:ngangasam704@gmail.com";
  };

  return (
    <div className="settings-overlay">
      <div className="settings-container">
        <button className="close-btn" onClick={onClose}>
          <i className="fas fa-times"></i>
        </button>
        <h3>Settings & Help</h3>

        {/* Settings Section */}
        <div className="section">
          <h4>Settings</h4>
          <div className="setting-item">
            <label>
              <input
                type="checkbox"
                checked={darkMode}
                onChange={handleDarkModeToggle}
              />
              Enable Dark Mode
            </label>
          </div>
        </div>

        {/* Help Section */}
        <div className="section">
          <h4>Need Help?</h4>
          <p>If you have any issues, feel free to reach out for assistance.</p>
          <button className="help-button" onClick={redirectToEmail}>
            Contact Support
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsAndHelp;