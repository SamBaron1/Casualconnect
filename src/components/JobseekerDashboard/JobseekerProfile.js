import React from "react";
import useFetchProfile from "../../hooks/useFetchProfile";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserCircle } from "@fortawesome/free-solid-svg-icons";
import "./JobseekerProfile.css";

const capitalize = (text) => {
  return text.replace(/\b\w/g, (char) => char.toUpperCase());
};

const JobseekerProfile = () => {
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
        <h2>{capitalize(profile.name)}</h2>
      </div>
      <div className="profile-body">
        <p>
          <strong>Email:</strong> {profile.email}
        </p>
        <p>
          <strong>Desired Job:</strong> {capitalize(profile.desiredJob)}
        </p>
        <p>
          <strong>Location:</strong> {capitalize(profile.location)}
        </p>
      </div>
    </div>
  );
};

export default JobseekerProfile;