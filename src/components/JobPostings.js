import React, { useEffect, useState } from "react";
import axios from "axios";
import useFetchJobs from "../hooks/useFetchJobs"; // Adjust the import path if necessary
import socket from "./config/socket"; // Ensure this path is correct
import { FaSearch } from "react-icons/fa"; // Import search icon
import "./JobPostings.css";

const JobPostings = () => {
  const { jobs, loadingJobs, error, retryFetchJobs } = useFetchJobs();
  const [liveJob, setLiveJob] = useState(null);
  const [searchTerm, setSearchTerm] = useState(""); // Store user search input

  // 🔹 Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 5; // Change this number to control jobs per page

  const userId = localStorage.getItem("userId"); // Assume userId is stored after login

  useEffect(() => {
    // Listen for live job updates
    socket.on("newJob", (job) => {
      setLiveJob(job);
      setTimeout(() => setLiveJob(null), 5000); // Remove live job update after 5 seconds
    });

    // Clean up the event listener
    return () => {
      socket.off("newJob");
    };
  }, []);
 
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
  const handleApply = async (jobId) => {
    try {
      await axios.post(`${API_BASE_URL}/jobseeker/${userId}/apply`, { jobId });
      alert("Application submitted successfully!");
      socket.emit("jobApplication", { userId, jobId });
    } catch (error) {
      console.error("Error applying for job:", error);
      alert("Failed to apply for job. Please try again.");
    }
  };

  const handleSave = async (jobId) => {
    try {
      await axios.post(`${API_BASE_URL}/jobseeker/${userId}/save`, { jobId });
      alert("Job saved successfully!");
    } catch (error) {
      console.error("Error saving job:", error);
      alert("Failed to save job. Please try again.");
    }
  };

  const capitalizeText = (text) => {
    if (!text) return "";
    return text
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  // 🔹 Ensure `jobs` is an array before filtering
  const filteredJobs = Array.isArray(jobs)
    ? jobs.filter((job) =>
        [job.title, job.location, job.jobType]
          .some((field) => field?.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    : [];

  // 🔹 Pagination Logic: Slice Jobs to Show Per Page
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const paginatedJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);

  // 🔹 Pagination Handlers
  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);
  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };
  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  return (
    <section className="job-listings-container">
      <h2>Job Feeds</h2>

      {/* 🔹 Search Bar */}
      <div className="search-container">
        <input
          type="text"
          placeholder="Search by title, location, or job type..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1); // Reset to page 1 when searching
          }}
        />
        <FaSearch className="search-icon" />
      </div>

      {loadingJobs ? (
        <p>Loading jobs...</p>
      ) : error ? (
        <div>
          <p>{error}</p>
          <button onClick={retryFetchJobs}>Retry</button>
        </div>
      ) : (
        <div className="job-listings">
          {liveJob && (
            <div className="live-job-update">
              <h3>{liveJob.title}</h3>
              <p>New Job Posted: {liveJob.description}</p>
            </div>
          )}
          {paginatedJobs.length === 0 ? (
            <p>No jobs match your search.</p>
          ) : (
            paginatedJobs.map((job) => (
              <div key={job.id} className="job-card">
                <h3>{capitalizeText(job.title)}</h3>
                <p><strong>Location:</strong> {capitalizeText(job.location)}</p>
                <p><strong>Job Description:</strong> {capitalizeText(job.description)}</p>
                <p><strong>Pay:</strong> {job.salary}</p>
                <p><strong>Job Type:</strong> {capitalizeText(job.jobType)}</p>
                <p><strong>Requirements:</strong> {capitalizeText(job.requirements)}</p>
                <p><strong>Benefits:</strong> {capitalizeText(job.benefits)}</p>
                <div className="job-buttons">
                  <button className="btn apply" onClick={() => handleApply(job.id)}>Apply Now</button>
                  <button className="btn save" onClick={() => handleSave(job.id)}>Save</button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* 🔹 Pagination Controls */}
      {totalPages > 1 && (
        <div className="pagination">
          <button disabled={currentPage === 1} onClick={handlePrevPage}>
            Previous
          </button>
          <span> Page {currentPage} of {totalPages} </span>
          <button disabled={currentPage === totalPages} onClick={handleNextPage}>
            Next
          </button>
        </div>
      )}
    </section>
  );
};

export default JobPostings;
