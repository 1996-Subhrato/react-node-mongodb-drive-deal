import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './Cars.module.css';
import CarCard from '../components/ui/CarCard';
import useCarStore from '../store/carStore';
import { CarSkeleton } from '../components/ui/Loaders';

const Cars = () => {
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const {
        cars,
        categories,
        loading,
        error,
        fetchCars,
        fetchCategories
    } = useCarStore();

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    useEffect(() => {
        fetchCars(selectedCategory);
    }, [selectedCategory, fetchCars]);

    const filteredCars = cars.filter(car =>
        car.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        car.brand.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className={styles.carsPage}>
            {/* Hero Section / Breadcrumb */}
            <section className={styles.heroSection}>
                <div className={styles.heroGlow}></div>
                <div className={styles.container}>
                    <div className={styles.heroContent}>
                        <span className={styles.badge}>Luxury Marketplace</span>
                        <h1 className={styles.heroTitle}>
                            Find Your Next <br />
                            <span className={styles.gradientText}>Premium Deal</span>
                        </h1>
                        <p className={styles.heroDesc}>
                            Explore our exclusive marketplace of certified premium vehicles. 
                            From luxury sedans to high-performance SUVs, find the perfect match for your lifestyle.
                        </p>
                        <div className={styles.breadcrumb}>
                            <Link to="/">Home</Link>
                            <i className="fas fa-chevron-right"></i>
                            <span>Marketplace</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Category Filter Section */}
            <section className={styles.filterSection}>
                <div className={styles.container}>
                    <div className={styles.sectionHeader}>
                        <div className={styles.titleArea}>
                            <h2>Curated <span className={styles.gradientText}>Categories</span></h2>
                            <p>Filter by vehicle type to find exactly what you're looking for</p>
                        </div>
                    </div>
                    
                    <div className={styles.categoryGrid}>
                        <div
                            className={`${styles.categoryCard} ${selectedCategory === 'all' ? styles.activeCategory : ''}`}
                            onClick={() => setSelectedCategory('all')}
                        >
                            <div className={styles.categoryIcon}>
                                <i className="fa-solid fa-car-side"></i>
                            </div>
                            <span>All Vehicles</span>
                        </div>
                        {categories.map((cat) => (
                            <div
                                key={cat._id}
                                className={`${styles.categoryCard} ${selectedCategory === cat._id ? styles.activeCategory : ''}`}
                                onClick={() => setSelectedCategory(cat._id)}
                            >
                                <div className={styles.categoryIcon}>
                                    <i className="fa-solid fa-layer-group"></i>
                                </div>
                                <span>{cat.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Inventory Section */}
            <section className={styles.inventorySection}>
                <div className={styles.container}>
                    <div className={styles.inventoryControls}>
                        <div className={styles.inventoryMeta}>
                            <h2>Market <span className={styles.gradientText}>Inventory</span></h2>
                            <span className={styles.countBadge}>{filteredCars.length} Vehicles Available</span>
                        </div>
                        
                        <div className={styles.searchWrapper}>
                            <i className="fa-solid fa-magnifying-glass"></i>
                            <input
                                type="text"
                                className={styles.searchInput}
                                placeholder="Search by model, brand, or features..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>

                    {error && (
                        <div className={styles.errorCard}>
                            <i className="fas fa-exclamation-circle"></i>
                            <p>{error}</p>
                            <button className={styles.retryBtn} onClick={() => fetchCars(selectedCategory)}>
                                Try Again
                            </button>
                        </div>
                    )}

                    <div className={styles.carGrid}>
                        {loading ? (
                            Array.from({ length: 8 }).map((_, i) => (
                                <CarSkeleton key={i} />
                            ))
                        ) : (
                            filteredCars.length > 0 ? (
                                filteredCars.map((car) => (
                                    <CarCard key={car._id} car={car} />
                                ))
                            ) : (
                                <div className={styles.emptyContainer}>
                                    <div className={styles.emptyContent}>
                                        <div className={styles.emptyIconArea}>
                                            <i className="fa-solid fa-car-on"></i>
                                            <div className={styles.radarPulse}></div>
                                        </div>
                                        <h3>No Vehicles Matching Your Search</h3>
                                        <p>Adjust your filters or search terms to explore more of our marketplace.</p>
                                        <button
                                            className={styles.resetBtn}
                                            onClick={() => { setSelectedCategory('all'); setSearchQuery(''); }}
                                        >
                                            <i className="fa-solid fa-rotate-left"></i>
                                            Reset All Filters
                                        </button>
                                    </div>
                                </div>
                            )
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Cars;
