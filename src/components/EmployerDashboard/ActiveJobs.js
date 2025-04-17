import React, { useEffect, useState } from "react";
import axios from "axios";
import "./ActiveJobs.css";

function ActiveJobs() {
  const [jobs, setJobs] = useState([]);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 5; // Number of jobs per page

  const userId = localStorage.getItem("userId"); // Assume userId is stored after login

  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/employer/${userId}/jobs?page=${currentPage}&pageSize=${pageSize}`
        );

        setJobs(response.data.jobs);
        setTotalPages(response.data.totalPages);
      } catch (error) {
        console.error("Error fetching jobs:", error);
        setError(error);
      }
    };

    fetchJobs();
  }, [userId, currentPage, API_BASE_URL]); // Re-fetch jobs when currentPage changes

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };
  const handleDeleteJob = async (jobId) => {
    try {
      await axios.delete(`${API_BASE_URL}/employer/${userId}/jobs/${jobId}`);
      setJobs(jobs.filter((job) => job.id !== jobId)); // Remove deleted job from UI
    } catch (error) {
      console.error("Error deleting job:", error);
      alert("Failed to delete job. Please try again.");
    }
  };
  

  return (
    <div className="active-jobs">
      <h2>Posted Jobs</h2>
      {error && <p className="error">Error fetching jobs: {error.message}</p>}

      <table>
        <thead>
          <tr>
            <th>Job Title</th>
            <th>Applications</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
      {Array.isArray(jobs) && jobs.length > 0 ? (
        jobs.map((job) => (
          <tr key={job.id}>
            <td data-label="Job Title">{job.title}</td>
            <td data-label="Applications">{job.applicationCount}</td>
            <td data-label="Status">{new Date(job.expiresAt) > new Date() ? "Active" : "Expired"}</td>
            <td data-label="Actions">
            <button className="btn-delete" onClick={() => handleDeleteJob(job.id)}>Delete</button>
            </td>
          </tr>
        ))
      ) : (
        <tr>
          <td colSpan="4" style={{ textAlign: "center" }}>No jobs available.</td>
        </tr>
      )}
    </tbody>
      
      </table>

      {/* Pagination Controls */}
      <div className="pagination">
        <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
          Previous
        </button>
        <span>Page {currentPage} of {totalPages}</span>
        <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
          Next
        </button>
      </div>
    </div>
  );
}

export default ActiveJobs;
