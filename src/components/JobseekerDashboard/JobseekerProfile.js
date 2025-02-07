import React from "react";
import useFetchProfile from "../../hooks/useFetchProfile";
import "./JobseekerProfile.css";

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
        <h2>{profile.name}</h2>
      </div>
      <div className="profile-body">
        <p><strong>Email:</strong> {profile.email}</p>
        <p><strong>Desired Job:</strong> {profile.desiredJob}</p>
        <p><strong>Location:</strong> {profile.location}</p>
      </div>
    </div>
  );
};

export default JobseekerProfile;