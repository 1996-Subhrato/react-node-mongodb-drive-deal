import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import carService from '../../services/carService';
import styles from './UserDashboard.module.css';

const UserDashboard = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [dashboardData, setDashboardData] = useState({
        stats: { total: 0, confirmed: 0, pending: 0, completed: 0 },
        recentCars: [],
        activities: []
    });

    useEffect(() => {
        const loadDashboard = async () => {
            try {
                setLoading(true);
                // Parallel fetching for performance
                const [statsRes, carsRes, requestsRes] = await Promise.all([
                    carService.getUserStats(),
                    carService.getCars('all', { limit: 4 }),
                    carService.getUserPurchaseRequests()
                ]);

                setDashboardData({
                    stats: statsRes.data.success ? statsRes.data.data : { total: 0, confirmed: 0, pending: 0, completed: 0 },
                    recentCars: carsRes.data.success ? carsRes.data.data : [],
                    activities: requestsRes.data.success ? requestsRes.data.data.slice(0, 5) : []
                });
            } catch (error) {
                console.error("Critical: Failed to load user dashboard", error);
            } finally {
                setLoading(false);
            }
        };

        loadDashboard();
    }, []);

    if (loading) {
        return (
            <div className={styles.dashboardWrapper} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div className="text-center">
                    <div className="spinner-grow text-warning mb-3" style={{ width: '3rem', height: '3rem' }}></div>
                    <h4 className="fw-bold text-slate-800">Fueling your experience...</h4>
                </div>
            </div>
        );
    }

    const statsConfig = [
        { key: 'total', label: 'Interests', icon: 'fas fa-eye', variant: styles.iconYellow },
        { key: 'pending', label: 'In Review', icon: 'fas fa-hourglass-start', variant: styles.iconBlue },
        { key: 'confirmed', label: 'Approved', icon: 'fas fa-certificate', variant: styles.iconGreen },
        { key: 'completed', label: 'Purchased', icon: 'fas fa-key', variant: styles.iconPurple }
    ];

    return (
        <div className={styles.dashboardWrapper}>
            <div className={styles.container}>

                {/* 1. Hero Command Center */}
                <header className={styles.heroHeader}>
                    <div className={styles.heroContent}>
                        <span className={styles.welcomeBadge}>Exclusive Buyer Access</span>
                        <h1 className={`${styles.title} text-white`}>Drive Your <span>Ambition</span>, {user?.first_name}</h1>
                        <p className={styles.subtitle}>
                            Welcome to your personalized dashboard. Manage your collections, track active negotiations,
                            and discover premium listings selected just for you.
                        </p>
                    </div>
                    <div className={styles.headerActions}>
                        <Link to="/cars" className={styles.primaryBtn}>
                            <i className="fas fa-search"></i>
                            <span>Explore Showroom</span>
                        </Link>
                    </div>
                </header>

                {/* 2. Key Metrics Row */}
                <section className={styles.statsContainer}>
                    {statsConfig.map((stat, i) => (
                        <div key={i} className={styles.statCard}>
                            <div className={styles.statHeader}>
                                <div className={`${styles.statIcon} ${stat.variant}`}>
                                    <i className={stat.icon}></i>
                                </div>
                                <span className={styles.statTrend}>+12%</span>
                            </div>
                            <div className={styles.statInfo}>
                                <h4>{stat.label}</h4>
                                <div className={styles.value}>{dashboardData.stats[stat.key] || 0}</div>
                            </div>
                        </div>
                    ))}
                </section>

                {/* 3. Main Dashboard Body */}
                <main className={styles.mainContent}>

                    {/* Recommendations Section */}
                    <section className={styles.section}>
                        <div className={styles.sectionHeader}>
                            <h2 className={styles.sectionTitle}>Curated For You</h2>
                            <Link to="/cars" className={styles.viewAll}>View Marketplace <i className="fas fa-arrow-right ms-2"></i></Link>
                        </div>
                        <div className={styles.carGrid}>
                            {dashboardData.recentCars.map((car, idx) => (
                                <div key={idx} className={styles.carCard}>
                                    <img
                                        src={car.photo ? `http://localhost:5000${car.photo}` : '/assets/car-placeholder.png'}
                                        alt={car.name}
                                        className={car.image}
                                    />
                                    <div className={styles.carBody}>
                                        <span className={styles.carTag}>{car.brand}</span>
                                        <h3 className={styles.carName}>{car.name}</h3>
                                        <div className={styles.carFooter}>
                                            <div className={styles.price}>₹{car.price?.toLocaleString()}</div>
                                            <Link to={`/single_car/${car._id}`} className={styles.viewBtn}>Full Specs</Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                </main>

                {/* 4. Insights Sidebar */}
                <aside className={styles.sidebar}>

                    {/* Activity Widget */}
                    <div className={styles.widget}>
                        <div className={styles.widgetHeader}>
                            <h3 className={styles.widgetTitle}>Negotiation Stream</h3>
                        </div>
                        <div className={styles.activityList}>
                            {dashboardData.activities.length > 0 ? (
                                dashboardData.activities.map((act, i) => (
                                    <div key={i} className={styles.activityItem}>
                                        <div className={styles.activityIcon}>
                                            <i className="fas fa-file-invoice-dollar"></i>
                                        </div>
                                        <div className={styles.activityInfo}>
                                            <h5>{act.car_id?.name || 'Inquiry'}</h5>
                                            <p>{new Date(act.createdAt).toLocaleDateString()}</p>
                                        </div>
                                        <span className={`${styles.activityStatus} ${act.status === 'confirmed' || act.status === 'completed' ? styles.statusSuccess : styles.statusWarn
                                            }`}>
                                            {act.status}
                                        </span>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-4 text-muted">
                                    No active negotiations
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Upsell Widget */}
                    <div className={styles.widget} style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)', border: 'none', color: 'white' }}>
                        <h3 className={styles.widgetTitle} style={{ color: 'white', marginBottom: '1rem' }}>Sell with Us</h3>
                        <p style={{ opacity: 0.9, fontSize: '0.9rem', lineHeight: '1.6' }}>
                            Have a premium vehicle to part with? Join our verified seller network and get the best valuation in the market.
                        </p>
                        <Link to="/seller/signup" className="btn btn-light w-100 mt-4 py-3 fw-bold rounded-pill" style={{ color: '#d97706' }}>
                            Upgrade to Seller
                        </Link>
                    </div>

                    {/* Support Widget */}
                    <div className={styles.widget}>
                        <h4 className="fw-bold mb-3">Concierge Service</h4>
                        <p className="text-muted small mb-4">Our premium support team is ready to assist with your valuation and transaction needs.</p>
                        <button className="btn btn-outline-dark w-100 rounded-pill py-2">Speak to Agent</button>
                    </div>

                </aside>
            </div>
        </div>
    );
};

export default UserDashboard;
