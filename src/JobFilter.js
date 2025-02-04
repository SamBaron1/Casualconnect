import React, { useState } from "react";
import axios from "axios";

const JobFilter = ({ setJobs }) => {  
  const [filters, setFilters] = useState({ title: "", jobType: "", location: "" });

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleFilter = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/jobs", {
        params: filters, // Send filters as query parameters
      });
      setJobs(response.data);  
    } catch (error) {
      console.error("Error fetching filtered jobs:", error);
    }
  };

  return (
    <div className="bg-white p-4 shadow-md rounded-xl w-full max-w-3xl mx-auto mt-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <input type="text" name="title" placeholder="Job Title" className="border p-2 rounded-md w-full" onChange={handleChange} />
        <select name="jobType" className="border p-2 rounded-md w-full" onChange={handleChange}>
          <option value="">All Job Types</option>
          <option value="Full-Time">Full-Time</option>
          <option value="Part-Time">Part-Time</option>
          <option value="Contract">Contract</option>
          <option value="Freelance">Freelance</option>
        </select>
        <input type="text" name="location" placeholder="Location" className="border p-2 rounded-md w-full" onChange={handleChange} />
      </div>
      <button onClick={handleFilter} className="w-full bg-blue-500 text-white p-2 rounded-md mt-4">Filter Jobs</button>
    </div>
  );
};

export default JobFilter;
