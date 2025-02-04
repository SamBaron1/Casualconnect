import { useState, useEffect, useCallback } from "react";
import axios from "axios";

const useFetchJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(false);
  const [error, setError] = useState(null);
  const [retry, setRetry] = useState(0); // State to track retries

  const fetchJobs = useCallback(async () => {
    setLoadingJobs(true);
    setError(null); // Reset error before fetching
    try {
      const response = await axios.get("http://localhost:5000/api/jobs");
      setJobs(response.data);
    } catch (error) {
      console.error("Error fetching jobs:", error);
      setError(error.response?.data?.error || "Failed to load jobs. Please try again.");
    } finally {
      setLoadingJobs(false);
    }
  }, []);
  
  useEffect(() => {
    fetchJobs();
  }, [fetchJobs, retry]); // Fetch jobs again if retry state changes

  const retryFetchJobs = () => {
    setRetry(prev => prev + 1); // Trigger a retry by incrementing retry state
  };

  return { jobs, loadingJobs, error, retryFetchJobs };
};

export default useFetchJobs;
