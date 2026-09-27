import axios from 'axios';
import toast from 'react-hot-toast';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';

const apiClient = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
});

// Response Interceptor for Global Error Handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    let message = 'Something went wrong';
    
    if (!error.response) {
      // Network Error or Server is down
      message = 'Cannot connect to server. Please check your connection.';
      toast.error(message);
    } else {
      message = error.response.data?.message || message;
      
      const skipToast = error.config.headers['x-skip-toast'];

      if (!skipToast) {
        if (error.response.status === 401) {
          // If it's a login request, don't show "Session expired"
          const isLoginRequest = error.config.url.includes('/login');
          if (!isLoginRequest) {
            toast.error('Session expired. Please login again.');
          } else {
            toast.error(message);
          }
        } else if (error.response.status === 403) {
          toast.error(message || 'You do not have permission to perform this action.');
        } else {
          toast.error(message);
        }
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
