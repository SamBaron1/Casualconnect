import React from "react";
import useFetchProfile from "../../hooks/useFetchProfile";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserCircle } from "@fortawesome/free-solid-svg-icons";
import "./EmployerProfile.css";

const capitalize = (text) => {
  if (!text) return ""; // Return an empty string if text is null or undefined
  return text.replace(/\b\w/g, (char) => char.toUpperCase());
};

const EmployerProfile = () => {
  const userId = localStorage.getItem("userId"); // Assume userId is stored after login
  const { profile, loading, error } = useFetchProfile(userId);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  if (!profile) {
    return <div className="no-profile">No profile found</div>;
  }

  return (
    <div className="profile-card">
      <div className="profile-header">
        <FontAwesomeIcon icon={faUserCircle} className="profile-icon" />
        <h2>{profile.name ? capitalize(profile.name) : "No Name Provided"}</h2>
      </div>
      <div className="profile-body">
        <p>
          <strong>Email:</strong> {profile.email}
        </p>
        <p>
          <strong>Company:</strong> {profile.companyName ? capitalize(profile.companyName) : "N/A"}
        </p>
        <p>
          <strong>Location:</strong> {profile.location ? capitalize(profile.location) : "N/A"}
        </p>
      </div>
    </div>
  );
};

export default EmployerProfile;