import React, { useState, useEffect } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from "./AuthContext"; // Adjust the path based on your file structure
import "./Navbar.css"; // Ensure this file exists for styling

const Navbar = ({ setShowLogin, setShowSignUp }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);

  const toggleMoreMenu = () => setMoreOpen(!moreOpen);
  const toggleMenu = () => setMenuOpen(!menuOpen);
  const { isAuthenticated, setIsAuthenticated, userRole } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token'); // Clear token
    setIsAuthenticated(false);
    navigate('/');
  };

  const handlePostJobClick = () => {
    if (isAuthenticated && userRole === 'employer') {
      navigate('/employer-dashboard/post-job'); // Navigate to the Post Job page
    } else if (!isAuthenticated) {
      alert("Please log in to post a job.");
      setShowLogin(true); // Show login modal
    } else {
      alert("Only employers can post jobs.");
    }
  };
  const handleFindJobsClick = (event) => {
    event.preventDefault(); // Prevent default anchor behavior
  
    const jobFilterSection = document.getElementById("JobFilter");
    if (jobFilterSection) {
      jobFilterSection.scrollIntoView({ behavior: "smooth" }); // Scroll smoothly
    } else {
      navigate("/jobs"); // Redirect if JobFilter is on another page
    }
  
    setMenuOpen(false);
  };
  

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (moreOpen && !e.target.closest('.dropdown')) {
        setMoreOpen(false);
      }
      if (menuOpen && !e.target.closest('.navbar')) {
        setMenuOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [moreOpen, menuOpen]);

  return (
    <nav className="navbar">
      <div className="logo">CasualConnect</div>
      <ul className={`nav-links ${menuOpen ? "active" : ""}`}>
        <li>
          <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>
        </li>
        <li>
          <a href="#JobFilter" onClick={handleFindJobsClick}>Find Jobs</a>
        </li>

        <li>
          <a href="#/employer-dashboard/post-job" onClick={() => { handlePostJobClick(); setMenuOpen(false); }}>Post a Job</a>
        </li>
        {isAuthenticated && (
          <li>
            <Link to={userRole === 'employer' ? '/employer-dashboard' : '/jobseeker-dashboard'} onClick={() => setMenuOpen(false)}>
              Dashboard
            </Link>
          </li>
        )}
        <li className="dropdown">
          <button className="more-button" onClick={toggleMoreMenu}>
            More &#9662; {/* Down arrow */}
          </button>
          {moreOpen && (
            <ul className="dropdown-menu">
              <li>
                <a href="#about" onClick={() => setMenuOpen(false)}>About</a>
              </li>
              <li>
                <a href="#contact" onClick={() => setMenuOpen(false)}>Contact</a>
              </li>
            </ul>
          )}
        </li>
        {/* Login and Signup Buttons in Mobile Menu */}
        {!isAuthenticated && (
          <>
            <li className="mobile-auth">
              <button onClick={() => { setShowLogin(true); setMenuOpen(false); }}>Login</button>
            </li>
            <li className="mobile-auth">
              <button onClick={() => { setShowSignUp(true); setMenuOpen(false); }}>Signup</button>
            </li>
          </>
        )}
        {/* Logout Button in Mobile Menu */}
        {isAuthenticated && (
          <li className="mobile-logout">
            <button onClick={handleLogout}>Logout</button>
          </li>
        )}
      </ul>

      {/* Login and Signup Buttons for Desktop */}
      <div className="navbar-buttons">
        {!isAuthenticated ? (
          <>
            <button onClick={() => { setShowLogin(true); setMenuOpen(false); }}>Login</button>
            <button onClick={() => { setShowSignUp(true); setMenuOpen(false); }}>Signup</button>
          </>
        ) : (
          <button onClick={handleLogout}>Logout</button>
        )}
      </div>

      {/* Hamburger Menu */}
      <button className="hamburger" onClick={toggleMenu}>
        &#9776; {/* Unicode for hamburger menu */}
      </button>
    </nav>
  );
};

export default Navbar;
