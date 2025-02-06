import axios from 'axios';
// axiosConfig.js
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
const API = axios.create({ baseURL: API_BASE_URL });

export default API;




// Subscribe to Newslettera
export const subscribeToNewsletter = async (email) => {
  try {
    const response = await API.post('/newsletter/subscribe', { email });
    return response.data;
  } catch (error) {
    console.error('Error subscribing to newsletter:', error);
    throw error;
  }
};

// Signup
export const signup = (data) => API.post('/auth/signup', data);

// Login
export const login = (data) => API.post('/auth/login', data);

// Post a Job
export const postJob = (data, token) => API.post('/jobs', data, {
  headers: { Authorization: `Bearer ${token}` }
});

// Fetch Jobs
export const fetchJobs = (filters) => API.get('/jobs', { params: filters });



