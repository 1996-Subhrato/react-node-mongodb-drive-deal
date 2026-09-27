import { useState, useEffect, useCallback } from 'react';
import carService from '../services/carService';

export const useCars = (categoryId = 'all', initialParams = {}) => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [meta, setMeta] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0
  });

  const fetchCars = useCallback(async (page = 1, filters = {}) => {
    try {
      setLoading(true);
      const response = await carService.getCars(categoryId, { page, ...initialParams, ...filters });
      if (response.data.success) {
        setCars(response.data.data);
        setMeta(response.data.meta);
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch cars');
    } finally {
      setLoading(false);
    }
  }, [categoryId, JSON.stringify(initialParams)]);

  useEffect(() => {
    fetchCars();
  }, [fetchCars]);

  return { 
    cars, 
    loading, 
    error, 
    meta, 
    refetch: fetchCars 
  };
};

export const useCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await carService.getCategories();
        if (response.data.success) {
          setCategories(response.data.data);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  return { categories, loading, error };
};
