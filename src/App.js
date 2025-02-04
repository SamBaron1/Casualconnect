import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { io } from 'socket.io-client';
import "./styles.css";
import Navbar from "./components/Navbar";
import SignupForm from "./components/SignupForm";
import LoginForm from "./components/LoginForm";
import Newsletter from "./components/NewsLetter";
import EmployerDashboard from "./components/EmployerDashboard/EmployerDashboard";
import JobseekerDashboard from "./components/JobseekerDashboard/JobseekerDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import { jwtDecode } from "jwt-decode"; // Correct named import
import JobPostings from "./components/JobPostings";
import JobFilter from "./JobFilter";
import axios from "axios";
import EmployerRatings from "./EmployerRatings";


const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false); 
  const [showLogin, setShowLogin] = useState(false); 
  const [showSignUp, setShowSignUp] = useState(false); 
  const [jobs, setJobs] = useState([]); // State to store filtered jobs
  const [userRole, setUserRole] = useState(null); 
  const navigate = useNavigate(); 

 
 
  
  useEffect(() => { 
    const token = localStorage.getItem("token"); 
    if (token) { 
      try { 
        const decoded = jwtDecode(token); 
        if (decoded.exp * 1000 > Date.now()) { 
          setIsAuthenticated(true); 
          setUserRole(decoded.role); // Set the user's role
        } else { 
          localStorage.removeItem("token"); 
        } 
      } catch (err) { 
        console.error("Invalid token:", err); 
      } 
    } 
  }, []); 

  useEffect(() => {
    const socket = io('http://localhost:5000', {
      withCredentials: true,
    });

    // Listen for notifications from the server
    socket.on('receiveNotification', (notification) => {
      console.log('Notification received:', notification);
      // Display the notification to the user
      if (Notification.permission === 'granted') {
        new Notification(notification.message);
      }
    });

    // Cleanup on unmount
    return () => {
      socket.off('receiveNotification'); // Remove the event listener
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
    console.log("Login button clicked"); 
    setShowLogin(true); 
    setShowSignUp(false); 
  }; 

  const handleSignUpClick = () => { 
    console.log("Sign Up button clicked"); 
    setShowSignUp(true); 
    setShowLogin(false); 
  };

  return (
    <div className="App">
      <Navbar 
        setShowSignUp={handleSignUpClick} 
        setShowLogin={handleLoginClick} 
      />
      
      {showSignUp && (
        <div className="modal-overlay"> 
          <div className="modal-content"> 
            <button className="close-button" onClick={() => setShowSignUp(false)}>×</button>
            <SignupForm setIsAuthenticated={setIsAuthenticated} setShowSignUp={setShowSignUp} /> 
          </div> 
        </div> 
      )}

      {showLogin && (
        <div className="modal-overlay"> 
          <div className="modal-content"> 
            <button className="close-button" onClick={() => setShowLogin(false)}>×</button>
            <LoginForm setIsAuthenticated={setIsAuthenticated} setShowLogin={setShowLogin} /> 
          </div> 
        </div> 
      )}

      {/* Main Content */}
      <main>
        <Routes>
          <Route path="/login" element={<LoginForm setIsAuthenticated={setIsAuthenticated} setShowLogin={setShowLogin} />} />
          <Route path="/signup" element={<SignupForm setShowSignUp={setShowSignUp} />} />
          <Route element={<ProtectedRoute isAuthenticated={isAuthenticated} userRole={userRole} requiredRole="employer" />}>
            <Route path="/employer-dashboard" element={<EmployerDashboard />} />
          </Route>
          <Route element={<ProtectedRoute isAuthenticated={isAuthenticated} userRole={userRole} requiredRole="jobseeker" />}>
            <Route path="/jobseeker-dashboard" element={<JobseekerDashboard />} />
          </Route>
          <Route path="/" element={
            <>
              <section className="tafutakazi">
                <JobPostings jobs={jobs} />
                <EmployerRatings />           
                <Newsletter />
              </section>
            </>
          } />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
    <footer className="footer">
      <div className="footer-content">
        <p>&copy; 2025 CasualConnect. All rights reserved.</p>
        <div className="footer-contact">
          <p>Email: <a href="mailto:ngangasam704@gmail.com">ngangasam704@gmail.com</a></p>
          <p>Contact: <a href="tel:+254748374257">+254 748 374 257</a></p>
        </div>
      </div>
    </footer>
    </div>
  );
};

export default App;
