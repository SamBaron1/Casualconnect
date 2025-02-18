import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AvailableJobs.css";

const AvailableJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 5; // Adjust this to control jobs per page
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        await axios.get(`http://localhost:5000/api/jobseeker/${userId}/info`);

        const jobsResponse = await axios.get(`http://localhost:5000/api/jobseeker/${userId}/jobs`);
        setJobs(jobsResponse.data);
      } catch (error) {
        console.error("Error fetching jobs:", error);
        setError(error);
      }
    };
    fetchJobs();
  }, [userId]);

  const handleApply = async (jobId) => {
    try {
      await axios.post(`http://localhost:5000/api/jobseeker/${userId}/apply`, { jobId });
      alert("Application submitted successfully!");
    } catch (error) {
      console.error("Error applying for job:", error);
      alert("Failed to apply for job. Please try again.");
    }
  };

  const handleSave = async (jobId) => {
    try {
      await axios.post(`http://localhost:5000/api/jobseeker/${userId}/save`, { jobId });
      alert("Job saved successfully!");
    } catch (error) {
      console.error("Error saving job:", error);
      alert("Failed to save job. Please try again.");
    }
  };

  // 🔹 Pagination Logic
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const paginatedJobs = jobs.slice(indexOfFirstJob, indexOfLastJob);
  const totalPages = Math.ceil(jobs.length / jobsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  return (
    <div className="jobs-container">
      <h3>Available Jobs</h3>
      {error && <p className="error">Error fetching jobs: {error.message}</p>}
      {paginatedJobs.length === 0 ? (
        <p>No jobs available in your location.</p>
      ) : (
        <>
          {paginatedJobs.map((job) => (
            <div key={job.id} className="job-item">
              <h4>{job.title}</h4>
              <p>{job.description}</p>
              <p>Location: {job.location}</p>
              <button className="btn apply" onClick={() => handleApply(job.id)}>Apply</button>
              <button className="btn save" onClick={() => handleSave(job.id)}>Save</button>
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

export default AvailableJobs;
