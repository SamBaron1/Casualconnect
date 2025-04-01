import React, { useEffect, useState } from "react";
import axios from "axios";
import "./JobApplications.css";

function JobApplications() {
  const [applications, setApplications] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState(""); // Single search term state
  const applicationsPerPage = 5; // Number of applications per page
  const userId = localStorage.getItem("userId"); // Assume userId is stored after login

  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  // Fetch job applications from backend
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/employer/${userId}/applications`);
        setApplications(response.data);
      } catch (error) {
        console.error("Error fetching applications:", error);
      }
    };
    fetchApplications();
  }, [userId, API_BASE_URL]);

  // Handle status update
  const handleUpdateStatus = async (applicationId, status) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/employer/${userId}/applications/${applicationId}`,
        { status }
      );
      setApplications((prev) =>
        prev.map((app) =>
          app.id === applicationId ? { ...app, status: response.data.status } : app
        )
      );
    } catch (error) {
      console.error(`Error updating application status to ${status}:`, error);
    }
  };

  // 🔹 Filter Logic
  const filteredApplications = applications.filter((application) => {
    const lowerSearchTerm = searchTerm.toLowerCase();
    const nameMatch = application.User.name.toLowerCase().includes(lowerSearchTerm);
    const desiredJobMatch = application.User.desiredJob.toLowerCase().includes(lowerSearchTerm);
    const locationMatch = application.User.location.toLowerCase().includes(lowerSearchTerm);
    return nameMatch || desiredJobMatch || locationMatch; // Use OR logic for single search
  });

  // Pagination Logic
  const indexOfLastApp = currentPage * applicationsPerPage;
  const indexOfFirstApp = indexOfLastApp - applicationsPerPage;
  const paginatedApplications = filteredApplications.slice(indexOfFirstApp, indexOfLastApp);
  const totalPages = Math.ceil(filteredApplications.length / applicationsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  return (
    <div className="applications">
      <h2>Job Applications</h2>

      {/* Single Search Bar */}
      <div className="filter-section">
        <input
          type="text"
          placeholder="🔍Applicant Name, Desired Job, or Location"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-bar"
        />
      </div>

      {/* Applications List */}
      {paginatedApplications.length === 0 ? (
        <p>No applications available.</p>
      ) : (
        <>
          <ul>
            {paginatedApplications.map((application) => (
              <li key={application.id} className="application-item">
                <div className="job-info">
                  <span className="job-title">Job Title: {application.Job.title}</span>
                  <span className="jobseeker-name">Applicant: {application.User.name}</span>
                  <span className="location">Location: {application.User.location}</span>
                  <span className="desired-job">Desired Job: {application.User.desiredJob}</span>
                  <span className="job-status">
                    Status:{" "}
                    <span className={`status ${application.status.toLowerCase()}`}>
                      {application.status}
                    </span>
                  </span>
                </div>
                <div className="application-actions">
                  <button
                    className="btn"
                    onClick={() => handleUpdateStatus(application.id, "Accepted")}
                  >
                    Accept
                  </button>
                  <button
                    className="btn reject"
                    onClick={() => handleUpdateStatus(application.id, "Rejected")}
                  >
                    Reject
                  </button>
                </div>
              </li>
            ))}
          </ul>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="pagination">
              <button disabled={currentPage === 1} onClick={handlePrevPage}>
                Previous
              </button>
              <span>Page {currentPage} of {totalPages}</span>
              <button disabled={currentPage === totalPages} onClick={handleNextPage}>
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default JobApplications;