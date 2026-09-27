import React, { useState, useEffect } from 'react';
import CarCard from '../ui/CarCard';
import useCarStore from '../../store/carStore';
import styles from './FeaturedCars.module.css';

const FeaturedCars = () => {
  const featuredCars = useCarStore(state => state.featuredCars);
  const categories = useCarStore(state => state.categories);
  const loading = useCarStore(state => state.loading);
  const fetchFeaturedCars = useCarStore(state => state.fetchFeaturedCars);
  const fetchCategories = useCarStore(state => state.fetchCategories);

  const [activeCategory, setActiveCategory] = useState('all');
  const [filteredCars, setFilteredCars] = useState([]);

  useEffect(() => {
    // Only fetch if we don't have data yet
    if (featuredCars.length === 0) fetchFeaturedCars();
    if (categories.length === 0) fetchCategories();
  }, [fetchFeaturedCars, fetchCategories, featuredCars.length, categories.length]);

  useEffect(() => {
    if (activeCategory === 'all') {
      setFilteredCars(featuredCars);
    } else {
      setFilteredCars(featuredCars.filter(car => car.category === activeCategory));
    }
  }, [activeCategory, featuredCars]);

  return (
    <section className={styles.section}>
      <div className="container">
        <div className={styles.titleArea}>
          <span className={styles.subTitle}>Top Car Inventory</span>
          <h2 className={styles.secTitle}>Latest Featured Car Inventory</h2>
        </div>

        <div className={styles.filterContainer}>
          <button 
            className={`${styles.filterBtn} ${activeCategory === 'all' ? styles.filterBtnActive : ''}`}
            onClick={() => setActiveCategory('all')}
          >
            All Vehicles
          </button>
          {categories.map((cat) => (
            <button 
              key={cat._id}
              className={`${styles.filterBtn} ${activeCategory === cat._id.toString() ? styles.filterBtnActive : ''}`}
              onClick={() => setActiveCategory(cat._id.toString())}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {filteredCars.length > 0 ? (
          <div className={styles.carsGrid}>
            {filteredCars.map((car) => (
              <CarCard key={car._id} car={car} />
            ))}
          </div>
        ) : (
          !loading && (
            <div className={styles.emptyState}>
              <div className={styles.emptyIconBox}>
                <div className={styles.pulseCircle}></div>
                <i className="fas fa-search"></i>
              </div>
              <h3 className={styles.emptyTitle}>No Matching Vehicles</h3>
              <p className={styles.emptyText}>
                We couldn't find any cars in this category right now. 
                Try exploring our other premium collections.
              </p>
              <button 
                className={styles.resetBtn}
                onClick={() => setActiveCategory('all')}
              >
                View All Vehicles
              </button>
            </div>
          )
        )}
      </div>
    </section>
  );
};

export default FeaturedCars;
