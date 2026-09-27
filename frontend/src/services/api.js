import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Important for sending cookies
});

// Request Interceptor
api.interceptors.request.use(
  (config) => {
    // Modify config before request is sent if needed
    // e.g., attach tokens from localStorage if not using cookies
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // Handle unauthorized access globally
      console.warn('Unauthorized access - redirecting to login');
      // window.location.href = '/login'; // Or use React Router navigate depending on setup
    }
    return Promise.reject(error);
  }
);

export default api;
