import { create } from 'zustand';
import carService from '../services/carService';

const useCarStore = create((set, get) => ({
  cars: [],
  categories: [],
  featuredCars: [],
  loading: false,
  error: null,
  lastFetched: null,

  fetchCars: async (categoryId = 'all', params = {}) => {
    set({ loading: true, error: null }); // Clear previous error
    try {
      const response = await carService.getCars(categoryId, params);
      set({ cars: response.data.data || [], loading: false });
    } catch (err) {
      set({ error: err.response?.data?.message || 'Failed to fetch cars', loading: false });
    }
  },

  fetchCategories: async () => {
    if (get().categories.length > 0) return;
    set({ loading: true, error: null }); // Clear previous error
    try {
      const response = await carService.getCategories();
      set({ categories: response.data.data || [], loading: false });
    } catch (err) {
      set({ error: err.response?.data?.message || 'Failed to fetch categories', loading: false });
    }
  },

  fetchFeaturedCars: async () => {
    set({ loading: true, error: null }); // Clear previous error
    try {
      const response = await carService.getCars('all', { limit: 6 });
      set({ featuredCars: response.data.data || [], loading: false });
    } catch (err) {
      set({ error: 'Failed to fetch featured cars', loading: false });
    }
  }
}));

export default useCarStore;
