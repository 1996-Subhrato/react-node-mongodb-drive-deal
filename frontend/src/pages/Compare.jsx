import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './Compare.module.css';
import useCarStore from '../store/carStore';

const Compare = () => {
    const { cars, fetchCars } = useCarStore();
    const [car1Id, setCar1Id] = useState('');
    const [car2Id, setCar2Id] = useState('');

    useEffect(() => {
        fetchCars('all');
    }, [fetchCars]);

    const car1 = cars.find(c => c._id === car1Id);
    const car2 = cars.find(c => c._id === car2Id);

    const getImageUrl = (photo) => {
        if (!photo) return '/assets/img/cars/car_placeholder.png';
        if (photo.startsWith('http') || photo.startsWith('blob')) return photo;
        const cleanPath = photo.startsWith('/') ? photo : `/uploads/${photo}`;
        return `http://localhost:5000${cleanPath}`;
    };

    const renderSpecRow = (label, icon, key) => (
        <div className={styles.specRow} key={key}>
            <div className={styles.specLabel}>
                <div className={styles.specIcon}><i className={icon}></i></div>
                <span>{label}</span>
            </div>
            <div className={styles.specValue}>{car1 ? car1[key] || 'N/A' : <span className={styles.emptyDash}>—</span>}</div>
            <div className={styles.specValue}>{car2 ? car2[key] || 'N/A' : <span className={styles.emptyDash}>—</span>}</div>
        </div>
    );

    return (
        <div className={styles.comparePage}>
            {/* Hero Section / Breadcrumb */}
            <section className={styles.heroSection}>
                <div className={styles.heroGlow}></div>
                <div className={styles.container}>
                    <div className={styles.heroContent}>
                        <span className={styles.badge}>Precision Comparison</span>
                        <h1 className={styles.heroTitle}>
                            Compare Your <br />
                            <span className={styles.gradientText}>Dream Vehicles</span>
                        </h1>
                        <p className={styles.heroDesc}>
                            Analyze specifications, performance, and market value side-by-side to make
                            the most informed decision for your next acquisition.
                        </p>
                        <div className={styles.breadcrumb}>
                            <Link to="/">Home</Link>
                            <i className="fas fa-chevron-right"></i>
                            <span>Compare Vehicles</span>
                        </div>
                    </div>
                </div>
            </section>

            <div className={styles.container}>
                <div className={styles.comparisonWrapper}>
                    <div className={styles.selectionHeader}>
                        <div className={styles.headerLabel}></div>

                        {/* Car 1 Selection Card */}
                        <div className={`${styles.carColumn} ${car1 ? styles.hasCar : ''}`}>
                            {car1 ? (
                                <div className={styles.carCard}>
                                    <div className={styles.imageBox}>
                                        <img src={getImageUrl(car1.photo)} alt={car1.name} />
                                    </div>
                                    <h3 className={styles.carName}>{car1.brand} {car1.name}</h3>
                                    <p className={styles.carPrice}>₹{car1.price}</p>
                                    <select
                                        className={styles.selectBtn}
                                        value={car1Id}
                                        onChange={(e) => setCar1Id(e.target.value)}
                                    >
                                        <option value="">Switch Vehicle</option>
                                        {cars.map(c => <option key={c._id} value={c._id}>{c.brand} {c.name}</option>)}
                                    </select>
                                </div>
                            ) : (
                                <div className={styles.emptyCard}>
                                    <div className={styles.plusIcon}><i className="fas fa-plus"></i></div>
                                    <p>Select First Vehicle</p>
                                    <select
                                        className={styles.selectBtn}
                                        value={car1Id}
                                        onChange={(e) => setCar1Id(e.target.value)}
                                    >
                                        <option value="">Choose a Car</option>
                                        {cars.map(c => <option key={c._id} value={c._id}>{c.brand} {c.name}</option>)}
                                    </select>
                                </div>
                            )}
                        </div>

                        {/* Car 2 Selection Card */}
                        <div className={`${styles.carColumn} ${car2 ? styles.hasCar : ''}`}>
                            {car2 ? (
                                <div className={styles.carCard}>
                                    <div className={styles.imageBox}>
                                        <img src={getImageUrl(car2.photo)} alt={car2.name} />
                                    </div>
                                    <h3 className={styles.carName}>{car2.brand} {car2.name}</h3>
                                    <p className={styles.carPrice}>₹{car2.price}</p>
                                    <select
                                        className={styles.selectBtn}
                                        value={car2Id}
                                        onChange={(e) => setCar2Id(e.target.value)}
                                    >
                                        <option value="">Switch Vehicle</option>
                                        {cars.map(c => <option key={c._id} value={c._id}>{c.brand} {c.name}</option>)}
                                    </select>
                                </div>
                            ) : (
                                <div className={styles.emptyCard}>
                                    <div className={styles.plusIcon}><i className="fas fa-plus"></i></div>
                                    <p>Select Second Vehicle</p>
                                    <select
                                        className={styles.selectBtn}
                                        value={car2Id}
                                        onChange={(e) => setCar2Id(e.target.value)}
                                    >
                                        <option value="">Choose a Car</option>
                                        {cars.map(c => <option key={c._id} value={c._id}>{c.brand} {c.name}</option>)}
                                    </select>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className={styles.specsTable}>
                        <div className={styles.tableTitle}>
                            <i className="fas fa-list-ul"></i> Technical Specifications
                        </div>
                        {renderSpecRow('Brand', 'fas fa-tag', 'brand')}
                        {renderSpecRow('Model Year', 'fas fa-calendar-alt', 'model')}
                        {renderSpecRow('Fuel Type', 'fas fa-gas-pump', 'fuelType')}
                        {renderSpecRow('Transmission', 'fas fa-cog', 'transmissionType')}
                        {renderSpecRow('Mileage', 'fas fa-tachometer-alt', 'mileage')}
                        {renderSpecRow('Engine', 'fas fa-bolt', 'engineCapacity')}
                        {renderSpecRow('KM Driven', 'fas fa-road', 'kmDriven')}
                        {renderSpecRow('Owner', 'fas fa-user-circle', 'ownerType')}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Compare;
