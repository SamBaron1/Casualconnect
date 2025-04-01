import React, { useState } from "react";
import axios from "axios";
import "./PostJob.css";

const capitalize = (text) => {
  if (typeof text !== 'string') return '';
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

function PostJob({ onClose }) {
  const userId = localStorage.getItem("userId"); // Assume userId is stored after login
  console.log('userId:', userId); // Debug log
  const [job, setJob] = useState({
    title: "",
    description: "",
    location: "",
    salary: "",
    jobType: "",
    requirements: "",
    benefits: "",
    employer_id: userId, // Include employerId in the job object
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
  
    // Handle salaryRange specifically
    if (name === 'salaryRange') {
      // Split the range value into min and max
      const range = value.split("-");
      if (range.length === 2) {
        const [minSalary, maxSalary] = range.map(Number);
  
        // Check if values are valid numbers
        if (!isNaN(minSalary) && !isNaN(maxSalary)) {
          setJob((prevJob) => ({
            ...prevJob,
            minSalary, // Save minimum salary
            maxSalary, // Save maximum salary
            salaryRange: value, // Save the input as a string
          }));
          return;
        }
      }
    }
  
    // Default behavior for other fields
    setJob((prevJob) => ({
      ...prevJob,
      [name]: name === 'jobType' ? value : capitalize(value), // Avoid capitalizing jobType
    }));
  };

  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const jobData = {
        ...job,
        employer_id: userId, // Set employerId correctly
      };
      console.log('Posting job:', jobData); // Debugging line
      await axios.post(`${API_BASE_URL}/jobs`, jobData);
      alert("Job posted successfully!");
      setJob({
        title: "",
        description: "",
        location: "",
        salary: "",
        jobType: "",
        requirements: "",
        benefits: "",
        employer_id: userId, // Reset employerId
      });
      onClose(); // Close the form modal
    } catch (error) {
      console.error("Error posting job:", error);
    }
  };
  
  return (
    <div className="post-job-modal">
      <div className="post-job">
        <h2>Post a Job</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Job Title:
            <input
              type="text"
              name="title"
              value={job.title}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Description:
            <textarea
              name="description"
              value={job.description}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Location:
            <input
              type="text"
              name="location"
              value={job.location}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Salary Range:
            <input
              type="text"
              name="salaryRange"
              value={job.salaryRange}
              onChange={handleChange}
              placeholder="e.g., 40000-50000"
            />
          </label>
          <label>
            Job Type:
            <select
              name="jobType"
              value={job.jobType}
              onChange={handleChange}
              required
            >
              <option value="">Select Type</option>
              <option value="Full-Time">Full-Time</option>
              <option value="Part-Time">Part-Time</option>
              <option value="Contract">Contract</option>
              <option value="Freelance">Freelance</option>
            </select>
          </label>
          <label>
            Requirements:
            <textarea
              name="requirements"
              value={job.requirements}
              onChange={handleChange}
            />
          </label>
          <label>
            Benefits:
            <textarea
              name="benefits"
              value={job.benefits}
              onChange={handleChange}
            />
          </label>
          <div className="form-buttons">
            <button type="submit" className="btn">Post Job</button>
            <button type="button" className="btn" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PostJob;
