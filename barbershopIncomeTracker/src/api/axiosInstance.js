import axios from 'axios';
const axiosInstance = axios.create({
 
  baseURL: import.meta.env.VITE_BASE_URL || 'http://localhost:5000', // Fallback to localhost if VITE_BASE_URL is not defined
  timeout: 10000, // Optional: Set a timeout for requests (in milliseconds)
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the token if it exists
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // Retrieve token from localStorage (or another storage)
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;