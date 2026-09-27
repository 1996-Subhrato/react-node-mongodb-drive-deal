import React, { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import styles from './BookingSuccess.module.css';

const BookingSuccess = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { paymentId, carName } = location.state || {};

    useEffect(() => {
        if (!location.state) {
            navigate('/');
        }
    }, [location.state, navigate]);

    return (
        <div className={styles.pageWrapper}>
            <div className={styles.glowContainer}>
                <div className={styles.glowBlue}></div>
                <div className={styles.glowPurple}></div>
            </div>

            <div className={styles.successCard}>
                <div className={styles.iconArea}>
                    <div className={styles.pulseRing}></div>
                    <div className={styles.mainIcon}>
                        <i className="fas fa-check"></i>
                    </div>
                </div>

                <div className={styles.textContent}>
                    <span className={styles.badge}>Payment Successful</span>
                    <h1 className={styles.title}>Your Ride is Ready!</h1>
                    <p className={styles.message}>
                        Success! Your reservation for <span className={styles.carHighlight}>{carName || 'your premium vehicle'}</span> is confirmed.
                    </p>
                </div>

                <div className={styles.infoGlass}>
                    <div className={styles.infoRow}>
                        <span className={styles.infoLabel}>Transaction ID</span>
                        <span className={styles.infoValue}>{paymentId || 'N/A'}</span>
                    </div>
                    <div className={styles.infoRow}>
                        <span className={styles.infoLabel}>Booking Status</span>
                        <span className={styles.statusChip}>
                            <i className="fas fa-shield-check"></i> Verified
                        </span>
                    </div>
                </div>

                <div className={styles.buttonGroup}>
                    <Link to="/user/mycars" className={styles.primaryBtn}>
                        <i className="fas fa-calendar-alt"></i>
                        Manage Bookings
                    </Link>
                    <Link to="/cars" className={styles.secondaryBtn}>
                        <i className="fas fa-arrow-left"></i>
                        Back to Fleet
                    </Link>
                </div>

                <div className={styles.cardFooter}>
                    <p>A detailed receipt has been sent to your email.</p>
                    <div className={styles.supportLink}>
                        Need help? <Link to="/contact">Contact Support</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookingSuccess;
