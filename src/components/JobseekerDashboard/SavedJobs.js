import React, { useEffect, useState } from "react";
import axios from "axios";
import "./SavedJobs.css";

const SavedJobs = () => {
  const [savedJobs, setSavedJobs] = useState([]);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 5; // Number of jobs per page
  const userId = localStorage.getItem("userId"); // Assume userId is stored after login

  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
  useEffect(() => {
    const fetchSavedJobs = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/jobseeker/${userId}/saved-jobs`);
        setSavedJobs(response.data);
      } catch (error) {
        console.error("Error fetching saved jobs:", error);
        setError(error);
      }
    };
    fetchSavedJobs();
  }, [userId, API_BASE_URL]);

  const handleApply = async (jobId) => {
    try {
      await axios.post(`${API_BASE_URL}/jobseeker/${userId}/apply`, { jobId });
      alert("Application submitted successfully!");
    } catch (error) {
      console.error("Error applying for job:", error);
      alert("Failed to apply for job. Please try again.");
    }
  };

  // 🔹 Pagination Logic
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const paginatedJobs = savedJobs.slice(indexOfFirstJob, indexOfLastJob);
  const totalPages = Math.ceil(savedJobs.length / jobsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  return (
    <div className="saved-jobs-container">
      <h3>Saved Jobs</h3>
      {error && <p className="error">Error fetching saved jobs: {error.message}</p>}
      {paginatedJobs.length === 0 ? (
        <p>No saved jobs available.</p>
      ) : (
        <>
          {paginatedJobs.map((savedJob) => (
            <div key={savedJob.id} className="job-item">
              <h4>{savedJob.Job.title}</h4>
              <p>{savedJob.Job.description}</p>
              <p>Save Date: {new Date(savedJob.createdAt).toLocaleDateString()}</p>
              <button className="apply-button" onClick={() => handleApply(savedJob.job_id)}>Apply Now</button>
            </div>
          ))}

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
};

export default SavedJobs;
