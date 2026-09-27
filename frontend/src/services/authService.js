import apiClient from './apiService';

const authService = {
  // User Auth
  userLogin: (credentials, config = {}) => apiClient.post('/user/login', credentials, config),
  userSignup: (userData) => apiClient.post('/user/register', userData),
  userLogout: () => apiClient.get('/user/logout'),
  checkUserToken: () => apiClient.get('/user/token'),

  // Seller Auth
  sellerLogin: (credentials, config = {}) => apiClient.post('/seller/login', credentials, config),
  sellerSignup: (userData) => apiClient.post('/seller/register', userData),
  sellerLogout: () => apiClient.get('/seller/logout'),
  checkSellerToken: () => apiClient.get('/seller/token'),

  // Admin Auth
  adminLogin: (credentials, config = {}) => apiClient.post('/admin/login', credentials, config),
  adminLogout: () => apiClient.get('/admin/logout'),
  checkAdminToken: () => apiClient.get('/admin/token'),
  
  // Generic profile fetch (based on role)
  getProfile: (role) => apiClient.get(`/${role}/showProfile`),
  updateProfile: (role, id, data) => {
    const url = id ? `/${role}/updateProfile/${id}` : `/${role}/updateProfile`;
    return apiClient.post(url, data);
  },
  updatePassword: (role, data, config = {}) => apiClient.put(`/${role}/changePassword`, data, config),
};

export default authService;
