import React from "react";

const ProfileOverview = () => {
  return (
    <div className="profile-overview">
      <img
        src="https://via.placeholder.com/100"
        alt="Profile"
        className="profile-photo"
      />
      <h2>John Doe</h2>
      <p>Location: Nairobi, Kenya</p>
      <button className="profile-btn">Edit Profile</button>
      <button className="profile-btn">Upload CV</button>
      <button className="profile-btn">Rate Employers</button>
    </div>
  );
};

export default ProfileOverview;
