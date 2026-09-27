import apiClient from './apiService';

const adminService = {
  // Seller Management
  getSellers: () => apiClient.get('/admin/fetchSeller'),
  updateSellerStatus: (id, status) => apiClient.put(`/admin/update_sellerstatus/${id}`, { status }),
  deleteSeller: (id) => apiClient.delete(`/admin/delete_seller/${id}`),

  // Category Management
  getCategories: () => apiClient.get('/admin/viewcategory'),
  addCategory: (formData) => apiClient.post('/admin/add_category', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  updateCategory: (id, formData) => apiClient.put(`/admin/update_category/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  deleteCategory: (id) => apiClient.delete(`/admin/delete_category/${id}`),

  // Purchase Requests & Users
  getPurchaseRequests: () => apiClient.get('/admin/fetchpurchase_requests'),
  getUsers: () => apiClient.get('/admin/fetchUsers'),
};

export default adminService;
