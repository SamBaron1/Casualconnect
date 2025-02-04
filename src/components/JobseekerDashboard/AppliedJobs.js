import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AppliedJobs.css";

const AppliedJobs = () => {
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 5; // Adjust as needed
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchAppliedJobs = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/jobseeker/${userId}/applications`);
        setAppliedJobs(response.data);
      } catch (error) {
        console.error("Error fetching applied jobs:", error);
        setError(error);
      }
    };
    fetchAppliedJobs();
  }, [userId]);

  // 🔹 Pagination Logic
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const paginatedJobs = appliedJobs.slice(indexOfFirstJob, indexOfLastJob);
  const totalPages = Math.ceil(appliedJobs.length / jobsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  return (
    <div className="applied-jobs-container">
      <h3>Applied Jobs</h3>
      {error && <p className="error">Error fetching applied jobs: {error.message}</p>}
      {paginatedJobs.length === 0 ? (
        <p>You have not applied for any jobs yet.</p>
      ) : (
        <>
          {paginatedJobs.map((job) => (
            <div key={job.id} className="job-item">
              <h4>{job.Job.title}</h4>
              <p>{job.Job.description}</p>
              <p>Status: <span className={`status ${job.status.toLowerCase()}`}>{job.status}</span></p>
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

export default AppliedJobs;
