import React, { useState, useEffect } from "react";
import axios from "axios";
import "./SystemSettings.css";

const SystemSettings = () => {
  const [settings, setSettings] = useState({
    appName: "",
    defaultLanguage: "",
    timeZone: "",
    maintenanceMode: false,
    contactEmail: "",
    contactPhone: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  // Fetch settings when component mounts
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await axios.get("/api/admin/settings");
        setSettings(response.data);
      } catch (error) {
        console.error("Error fetching settings:", error);
      }
    };

    fetchSettings();
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings((prevSettings) => ({
      ...prevSettings,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Submit updated settings
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await axios.put("/api/admin/settings", settings);
      alert("Settings updated successfully!");
    } catch (error) {
      console.error("Error updating settings:", error);
      alert("Failed to update settings.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="system-settings">
      <h2>System Settings</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Application Name:</label>
          <input
            type="text"
            name="appName"
            value={settings.appName}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Default Language:</label>
          <select
            name="defaultLanguage"
            value={settings.defaultLanguage}
            onChange={handleChange}
          >
            <option value="en">English</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
          </select>
        </div>

        <div className="form-group">
          <label>Time Zone:</label>
          <select name="timeZone" value={settings.timeZone} onChange={handleChange}>
            <option value="UTC">UTC</option>
            <option value="EST">EST</option>
            <option value="PST">PST</option>
          </select>
        </div>

        <div className="form-group checkbox-group">
          <label>
            <input
              type="checkbox"
              name="maintenanceMode"
              checked={settings.maintenanceMode}
              onChange={handleChange}
            />
            Maintenance Mode
          </label>
        </div>

        <div className="form-group">
          <label>Contact Email:</label>
          <input
            type="email"
            name="contactEmail"
            value={settings.contactEmail}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Contact Phone:</label>
          <input
            type="text"
            name="contactPhone"
            value={settings.contactPhone}
            onChange={handleChange}
          />
        </div>

        <button type="submit" disabled={isLoading} className="submit-btn">
          {isLoading ? "Saving..." : "Save Settings"}
        </button>
      </form>
    </div>
  );
};

export default SystemSettings;