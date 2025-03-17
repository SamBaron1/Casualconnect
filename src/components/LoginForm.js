import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from './AuthContext'; // Add this import
import "../styles.css";

const LoginForm = ({ setShowLogin }) => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const { setIsAuthenticated, setUserRole } = useAuth(); // Use setUserRole from context
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
 
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      setIsLoading(false);

      if (!response.ok) {
        alert(data.message || "An error occurred. Please try again.");
        return;
      }

      alert(data.message);
      localStorage.setItem("token", data.token);
      setIsAuthenticated(true);
      setUserRole(data.role); // Set the user role from response
      setShowLogin(false);

const dashboardRoute =
  data.role === "admin"
    ? "/admin-dashboard"
    : data.role === "employer"
    ? "/employer-dashboard"
    : "/jobseeker-dashboard";
navigate(dashboardRoute);
    } catch (error) {
      console.error("Error:", error);
      setIsLoading(false);
      alert("An unexpected error occurred. Please try again.");
    }
  };

  const handleForgotPassword = async () => {
    const email = prompt("Please enter your email address:");
    if (!email) return;

    try {
      const response = await fetch(`${API_BASE_URL}/auth/send-reset-link`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "An error occurred. Please try again.");
        return;
      }

      alert(data.message);
    } catch (error) {
      console.error("Error:", error);
      alert("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <div className="modal-content">
      <div className="login-signup-form">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
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
          <div>
            <label>Password:</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" disabled={isLoading}>
            {isLoading ? "Logging in..." : "Login"}
          </button>
          <button type="button" onClick={() => setShowLogin(false)}>
            Close
          </button>
        </form>
        <button type="button" onClick={handleForgotPassword} className="forgot-password-button">
          Forgot Password?
        </button>
      </div>
    </div>
  );
};

export default LoginForm;
