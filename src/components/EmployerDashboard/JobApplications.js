import React, { useEffect, useState } from "react";
import axios from "axios";
import "./JobApplications.css";

function JobApplications() {
  const [applications, setApplications] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const applicationsPerPage = 5; // Number of applications per page
  const userId = localStorage.getItem("userId"); // Assume userId is stored after login

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/employer/${userId}/applications`);
        setApplications(response.data);
      } catch (error) {
        console.error("Error fetching applications:", error);
      }
    };
    fetchApplications();
  }, [userId]);

  const handleUpdateStatus = async (applicationId, status) => {
    try {
      const response = await axios.post(`http://localhost:5000/api/employer/${userId}/applications/${applicationId}`, { status });
      setApplications(applications.map(app => app.id === applicationId ? { ...app, status: response.data.status } : app));
      setApplications((prev) =>
        prev.map((app) =>
          app.id === applicationId ? { ...app, status } : app
        )
      );
    } catch (error) {
      console.error(`Error updating application status to ${status}:`, error);
    }
  };
  

  // 🔹 Pagination Logic
  const indexOfLastApp = currentPage * applicationsPerPage;
  const indexOfFirstApp = indexOfLastApp - applicationsPerPage;
  const paginatedApplications = applications.slice(indexOfFirstApp, indexOfLastApp);
  const totalPages = Math.ceil(applications.length / applicationsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  return (
    <div className="applications">
      <h2>Job Applications</h2>
      {paginatedApplications.length === 0 ? (
        <p>No applications available.</p>
      ) : (
        <>
          <ul>
            {paginatedApplications.map((application) => (
              <li key={application.id} className="application-item">
                <div className="job-info">
                  <span className="job-title">{application.Job.title}</span>
                  <span className="job-description">{application.Job.description}</span>
                  <span className="jobseeker-name">Applicant: {application.User.name}</span>
                  <span className="job-status">Status: <span className={`status ${application.status.toLowerCase()}`}>{application.status}</span></span>
                </div>
                <div className="application-actions">
                  <button className="btn" onClick={() => handleUpdateStatus(application.id, 'Accepted')}>Accept</button>
                  <button className="btn reject" onClick={() => handleUpdateStatus(application.id, 'Rejected')}>Reject</button>
                </div>
              </li>
            ))}
          </ul>

          {/* 🔹 Pagination Controls */}
          {totalPages > 1 && (
            <div className="pagination">
              <button disabled={currentPage === 1} onClick={handlePrevPage}>Previous</button>
              <span> Page {currentPage} of {totalPages} </span>
              <button disabled={currentPage === totalPages} onClick={handleNextPage}>Next</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default JobApplications;
