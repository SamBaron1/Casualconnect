import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { io } from "socket.io-client";
import "./styles.css";
import Navbar from "./components/Navbar";
import SignupForm from "./components/SignupForm";
import LoginForm from "./components/LoginForm";
import Newsletter from "./components/NewsLetter";
import EmployerDashboard from "./components/EmployerDashboard/EmployerDashboard";
import JobseekerDashboard from "./components/JobseekerDashboard/JobseekerDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import JobPostings from "./components/JobPostings";
import AdminDashboard from "./components/AdminDashboard/AdminDashboard";
import axios from "axios";
import EmployerRatings from "./EmployerRatings";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(""); // Track user role
  const [showLogin, setShowLogin] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const [jobs, setJobs] = useState([]); // State to store filtered jobs

 

  useEffect(() => {
    const socket = io("http://localhost:5000", {
      withCredentials: true,
    });

    // Request notification permission
    if (Notification.permission !== "granted") {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          console.log("Notification permission granted.");
        } else {
          console.log("Notification permission denied.");
        }
      });
    }

    // Listen for notifications from the server
    socket.on("receiveNotification", (notification) => {
      console.log("Notification received:", notification);
      if (Notification.permission === "granted") {
        new Notification(notification.message);
      }
    });

    // Cleanup on unmount
    return () => {
      socket.off("receiveNotification");
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    // Fetch all jobs initially
    const fetchJobs = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/jobs");
        setJobs(response.data);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      }
    };

    fetchJobs();
  }, []);

  const handleLoginClick = () => {
    setShowLogin(true);
    setShowSignUp(false);
  };

  const handleSignUpClick = () => {
    setShowSignUp(true);
    setShowLogin(false);
  };

  return (
    <div className="App">
      <Navbar setShowSignUp={handleSignUpClick} setShowLogin={handleLoginClick} />

      {showSignUp && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-button" onClick={() => setShowSignUp(false)}>
              ×
            </button>
            <SignupForm setIsAuthenticated={setIsAuthenticated} setShowSignUp={setShowSignUp} />
          </div>
        </div>
      )}

      {showLogin && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-button" onClick={() => setShowLogin(false)}>
              ×
            </button>
            <LoginForm setIsAuthenticated={setIsAuthenticated} setShowLogin={setShowLogin} />
          </div>
        </div>
      )}

      {/* Main Content */}
      <main>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginForm setShowLogin={setShowLogin} />} />
          <Route path="/signup" element={<SignupForm setShowSignUp={setShowSignUp} />} />
          <Route
            path="/"
            element={
              <>
                <section className="tafutakazi">
                  <JobPostings jobs={jobs} />
                  <EmployerRatings />
                  <Newsletter />
                </section>
              </>
            }
          />

          {/* Protected Routes */}
          <Route
            element={<ProtectedRoute isAuthenticated={isAuthenticated} requiredRole="employer" userRole={userRole} />}
          >
            <Route path="/employer-dashboard" element={<EmployerDashboard />} />
          </Route>
          <Route
            element={<ProtectedRoute isAuthenticated={isAuthenticated} requiredRole="jobseeker" userRole={userRole} />}
          >
            <Route path="/jobseeker-dashboard" element={<JobseekerDashboard />} />
          </Route>
          <Route
            element={<ProtectedRoute isAuthenticated={isAuthenticated} requiredRole="admin" userRole={userRole} />}
          >
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
          </Route>

          {/* Redirect unknown routes */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
      <footer className="footer">
        <div className="footer-content">
          <p>&copy; 2025 CasualConnect. All rights reserved.</p>
          <div className="footer-contact">
            <p>
              Email: <a href="mailto:ngangasam704@gmail.com">ngangasam704@gmail.com</a>
            </p>
            <p>
              Contact: <a href="tel:+254748374257">+254 748 374 257</a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
