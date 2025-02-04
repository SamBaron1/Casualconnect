import React, { useState } from "react";
import "./LoginSignupForm.css";

const LoginSignupForm = ({ setShowSignUp }) => {
  const [userType, setUserType] = useState("jobseeker");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    companyName: "",
    position: "",
    jobTitle: "",
    companySize: "",
    desiredJob: "",
    experience: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`You have signed up as a ${userType}`);
    setShowSignUp(false);
  };

  return (
    <div className="login-signup-form">
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <div className="radio-group">
          <label>
            <input
              type="radio"
              name="userType"
              value="employer"
              checked={userType === "employer"}
              onChange={(e) => setUserType(e.target.value)}
            />
            Employer
          </label>
          <label>
            <input
              type="radio"
              name="userType"
              value="jobseeker"
              checked={userType === "jobseeker"}
              onChange={(e) => setUserType(e.target.value)}
            />
            Job Seeker
          </label>
        </div>
        <div>
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        {userType === "employer" && (
          <>
            <div>
              <label>Company Name:</label>
              <input
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
              />
            </div>
            <div>
              <label>Position:</label>
              <input
                type="text"
                name="position"
                value={formData.position}
                onChange={handleChange}
              />
            </div>
            <div>
              <label>Job Title:</label>
              <input
                type="text"
                name="jobTitle"
                value={formData.jobTitle}
                onChange={handleChange}
              />
            </div>
            <div>
              <label>Company Size:</label>
              <input
                type="text"
                name="companySize"
                value={formData.companySize}
                onChange={handleChange}
              />
            </div>
          </>
        )}
        {userType === "jobseeker" && (
          <>
            <div>
              <label>Desired Job:</label>
              <input
                type="text"
                name="desiredJob"
                value={formData.desiredJob}
                onChange={handleChange}
              />
            </div>
            <div>
              <label>Experience:</label>
              <input
                type="text"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
              />
            </div>
          </>
        )}
        <button type="submit">Sign Up</button>
        <button type="button" onClick={() => setShowSignUp(false)}>
          Close
        </button>
      </form>
    </div>
  );
};

export default LoginSignupForm;
