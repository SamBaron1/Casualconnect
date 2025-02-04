import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import "./SignupForm.css";

const SignupForm = ({ setShowSignUp }) => {
  const [userType, setUserType] = useState("jobseeker");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    companyName: "",
    position: "",
    location: "",
    companySize: "",
    desiredJob: "",
    password: "",
  });

  const { setIsAuthenticated, setUserRole } = useAuth();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    return passwordRegex.test(password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const newErrors = {};
    if (!validateEmail(formData.email)) {
      newErrors.email = "Invalid email address.";
    }
    if (!validatePassword(formData.password)) {
      newErrors.password = "Password must be at least 8 characters long, include 1 uppercase letter, 1 lowercase letter, and 1 number.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, role: userType }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to sign up.");
      }

      const data = await response.json();
      alert(data.message);

      localStorage.setItem("token", data.token);
      setIsAuthenticated(true);
      setUserRole(userType);
      navigate(userType === "jobseeker" ? "/jobseeker-dashboard" : "/employer-dashboard");
    } catch (error) {
      alert(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-button" onClick={() => setShowSignUp(false)}>
          &times;
        </button>
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
              {errors.email && <p className="error">{errors.email}</p>}
            </div>
            <div>
              <label>Password:</label>
              <div className="password-toggle">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? "Hide" : "Show"} Password
                </button>
              </div>
              {errors.password && <p className="error">{errors.password}</p>}
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
                  <label>Location:</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
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
                  <label>Location:</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                  />
                </div>
              </>
            )}
            <button type="submit" disabled={isLoading}>
              {isLoading ? "Signing Up..." : "Sign Up"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignupForm;