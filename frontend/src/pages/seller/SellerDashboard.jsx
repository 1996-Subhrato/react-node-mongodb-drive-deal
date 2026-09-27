import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import carService from '../../services/carService';
import { useAuth } from '../../context/AuthContext';
import styles from './SellerDashboard.module.css';

const SellerDashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        vehicles: 0,
        pending: 0,
        sold: 0,
        revenue: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                setLoading(true);
                const response = await carService.getSellerStats();
                if (response.data.success) {
                    setStats(response.data.data || { vehicles: 0, pending: 0, sold: 0, revenue: 0 });
                }
            } catch (error) {
                console.error('Failed to fetch stats:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) return (
        <div className={styles.loadingContainer}>
            <div className={styles.spinner}></div>
            <p>Loading your dashboard...</p>
        </div>
    );

    const statCards = [
        { label: 'Total Inventory', value: stats.vehicles, icon: 'fas fa-car', color: '#3b82f6', bg: '#eff6ff' },
        { label: 'Buy Requests', value: stats.pending, icon: 'fas fa-hourglass-half', color: '#f59e0b', bg: '#fffbeb' },
        { label: 'Vehicles Sold', value: stats.sold, icon: 'fas fa-check-double', color: '#10b981', bg: '#f0fdf4' },
        { label: 'Total Revenue', value: `₹${stats.revenue?.toLocaleString()}`, icon: 'fas fa-wallet', color: '#ea580c', bg: '#fff7ed' }
    ];

    const maxStat = Math.max(stats.vehicles, stats.pending, stats.sold) || 1;

    return (
        <div className={styles.dashboard}>
            <div className={styles.header}>
                <div>
                    <h1 className={styles.title}>Seller Dashboard</h1>
                    <p className={styles.subtitle}>Welcome back, {user?.name}</p>
                </div>
                <button className={styles.btnPrimary} onClick={() => navigate('/seller/manage_cars')}>
                    <i className="fas fa-plus me-2"></i> Add Car
                </button>
            </div>

            <div className={styles.statsRow}>
                {statCards.map((card, i) => (
                    <div key={i} className={styles.statCard}>
                        <div className={styles.statIcon} style={{ color: card.color, backgroundColor: card.bg }}>
                            <i className={card.icon}></i>
                        </div>
                        <div className={styles.statBody}>
                            <span className={styles.statLabel}>{card.label}</span>
                            <span className={styles.statValue}>{card.value}</span>
                        </div>
                    </div>
                ))}
            </div>

            <div className={styles.mainGrid}>
                <div className={styles.chartCard}>
                    <h3 className={styles.cardTitle}>Sales Performance</h3>
                    <div className={styles.chartArea}>
                        {statCards.slice(0, 3).map((bar, i) => (
                            <div key={i} className={styles.barGroup}>
                                <div className={styles.barTrack}>
                                    <div 
                                        className={styles.barFill} 
                                        style={{ 
                                            height: `${(typeof bar.value === 'number' ? bar.value : 0) / maxStat * 100}%`,
                                            backgroundColor: bar.color
                                        }}
                                    ></div>
                                </div>
                                <span className={styles.barLabel}>{bar.label}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className={styles.actionsCard}>
                    <h3 className={styles.cardTitle}>Quick Actions</h3>
                    <div className={styles.actionList}>
                        <div className={styles.actionItem} onClick={() => navigate('/seller/manage_cars')}>
                            <div className={styles.actionIconWrap}><i className="fas fa-list"></i></div>
                            <div>
                                <h4>Manage Inventory</h4>
                                <p>Update or delete cars</p>
                            </div>
                        </div>
                        <div className={styles.actionItem} onClick={() => navigate('/seller/purchase_requests')}>
                            <div className={styles.actionIconWrap}><i className="fas fa-hand-holding-heart"></i></div>
                            <div>
                                <h4>Active Requests</h4>
                                <p>Approve buyers</p>
                            </div>
                        </div>
                        <div className={styles.actionItem} onClick={() => navigate('/seller/view_sold_cars')}>
                            <div className={styles.actionIconWrap}><i className="fas fa-history"></i></div>
                            <div>
                                <h4>Sold History</h4>
                                <p>View past sales</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SellerDashboard;
