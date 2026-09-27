import apiClient from './apiService';

const carService = {
  // Public
  getCategories: () => apiClient.get('/fetchCategories'),
  getCars: (categoryId = 'all', params = {}) => apiClient.get(`/fetchcars/${categoryId}`, { params }),
  getSingleCar: (id) => apiClient.get(`/fetchSingleCar/${id}`),
  getReviews: (params = {}) => apiClient.get('/fetchreviews', { params }),

  // User Actions
  getUserStats: () => apiClient.get('/user/stats'),
  addPurchaseRequest: (data) => apiClient.post('/user/addPurchaseRequest', data),
  addReview: (data) => apiClient.post('/user/addreview', data),
  getUserPurchaseRequests: () => apiClient.get('/user/fetchMyPurchaseRequests'),
  checkPurchaseRequest: (carId) => apiClient.get(`/user/check_request/${carId}`),

  // Seller Actions
  getSellerStats: () => apiClient.get('/seller/stats'),
  getSellerCars: () => apiClient.get('/seller/fetchcars'),
  addCar: (data) => apiClient.post('/seller/addcar', data),
  updateCar: (id, data) => apiClient.put(`/seller/updatecar/${id}`, data),
  deleteCar: (id) => apiClient.delete(`/seller/deletecar/${id}`),
  
  getSellerRequests: (params = {}) => apiClient.get('/seller/fetchcarreq', { params }),
  getCarsWithRequests: (params = {}) => apiClient.get('/seller/fetchcarswithrequests', { params }),
  getSellerSoldCars: (params = {}) => apiClient.get('/seller/fetchapprovedbooking', { params }),
  
  updateRequestStatus: (id, status) => apiClient.put(`/seller/updatereq/${id}`, { status }),
  updateCarStatus: (id, status) => apiClient.put(`/seller/updateCar/${id}`, { status }),
};

export default carService;
