import React, { useState, useEffect } from 'react';
import adminService from '../../services/adminService';
import styles from './AdminShared.module.css';

const ViewBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                setLoading(true);
                const response = await adminService.getBookings();
                if (response.data.success) {
                    setBookings(response.data.data || []);
                }
            } catch (error) {
                console.error('Failed to fetch bookings:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchBookings();
    }, []);

    const getStatusStyle = (status) => {
        switch (status) {
            case 'Completed': return `${styles.statusBadge} ${styles.statusCompleted}`;
            case 'Pending': return `${styles.statusBadge} ${styles.statusPending}`;
            case 'Cancelled': return `${styles.statusBadge} ${styles.statusCancelled}`;
            case 'Approved': return `${styles.statusBadge} ${styles.statusApproved}`;
            default: return styles.statusBadge;
        }
    };

    if (loading) return (
        <div className="d-flex justify-content-center align-items-center" style={{ height: '60vh' }}>
            <div className="spinner-border text-warning" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
        </div>
    );

    return (
        <div className={styles.container}>
            <div className="d-flex justify-content-between align-items-center mb-5">
                <h2 className={styles.title}>Booking Management</h2>
                <div className={styles.statsBadge}>
                    <i className="fas fa-calendar-check"></i>
                    <span>Total Bookings: <strong>{bookings.length}</strong></span>
                </div>
            </div>

            <div className={styles.grid}>
                {bookings.length > 0 ? (
                    bookings.map((booking) => (
                        <div key={booking._id} className={styles.gridCard}>
                            <div className={styles.gridCardImgWrapper}>
                                <img 
                                    src={`http://localhost:5000/uploads/${booking.car?.photo}`} 
                                    alt="car" 
                                    className={styles.gridCardImg} 
                                    onError={(e) => e.target.src = 'https://via.placeholder.com/300x160?text=Car'}
                                />
                                <div style={{ position: 'absolute', top: '12px', right: '12px' }}>
                                    <span className={getStatusStyle(booking.status)}>
                                        {booking.status}
                                    </span>
                                </div>
                            </div>
                            <div className={styles.gridCardBody}>
                                <h4 className={styles.gridCardTitle}>{booking.car?.brand} {booking.car?.name}</h4>
                                
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <span className="fw-bold" style={{ color: '#38bdf8' }}>Rs. {booking.car?.price?.toLocaleString()}</span>
                                    <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>{booking.car?.model}</span>
                                </div>
                                
                                <div className="user-info p-3 rounded-4 mb-2" style={{ backgroundColor: 'rgba(15, 23, 42, 0.4)', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                                    <span className="d-block small fw-bold mb-2" style={{ color: '#38bdf8', letterSpacing: '0.5px' }}>CUSTOMER</span>
                                    <p className="small mb-1 fw-bold" style={{ color: '#f8fafc' }}>{booking.user?.first_name} {booking.user?.last_name}</p>
                                    <p className="small mb-0" style={{ color: '#94a3b8' }}>{booking.user?.email}</p>
                                </div>

                                <div className="dealer-info p-3 rounded-4 mb-3" style={{ backgroundColor: 'rgba(15, 23, 42, 0.4)', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                                    <span className="d-block small fw-bold mb-2" style={{ color: '#6366f1', letterSpacing: '0.5px' }}>DEALER</span>
                                    <p className="small mb-1 fw-bold" style={{ color: '#f8fafc' }}>{booking.dealer?.name}</p>
                                    <p className="small mb-0" style={{ color: '#94a3b8' }}>{booking.dealer?.email}</p>
                                </div>

                                <p className="small text-center mb-0" style={{ color: '#64748b' }}>
                                    <i className="fa-regular fa-clock me-1"></i> {new Date(booking.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-12 text-center py-5">
                        <p className="fs-5" style={{ color: '#94a3b8' }}>No bookings found in the system.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ViewBookings;
