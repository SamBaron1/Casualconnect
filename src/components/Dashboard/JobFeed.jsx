import React from "react";

const JobFeed = ({ jobs }) => {
  return (
    <div className="job-feed">
      <h3>Recommended Jobs</h3>
      {jobs.map((job) => (
        <div key={job.id} className="job-card">
          <h4>{job.title}</h4>
          <p>Location: {job.location}</p>
          <p>Salary: {job.salary}</p>
          <button className="apply-btn">Apply Now</button>
          <button className="save-btn">Save Job</button>
        </div>
      ))}
    </div>
  );
};

export default JobFeed;
