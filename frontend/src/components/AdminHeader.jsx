import React from 'react';
import { useLocation } from 'react-router-dom';
import styles from './AdminHeader.module.css';

const AdminHeader = () => {
    const location = useLocation();

    const getPageTitle = (pathname) => {
        switch (pathname) {
            case '/admin/dashboard': return 'Dashboard Overview';
            case '/admin/manage_dealers': return 'Dealer Management';
            case '/admin/manage_categories': return 'Category Management';
            case '/admin/view_bookings': return 'Booking Logs';
            case '/admin/change_password': return 'Account Settings';
            default: return 'Admin Panel';
        }
    };

    return (
        <header className={styles.header}>
            <div className={styles.left}>
                <h2 className={styles.pageTitle}>{getPageTitle(location.pathname)}</h2>
            </div>

            <div className={styles.actions}>
                {/* <div className={styles.searchBar}> */}
                {/* <i className="fas fa-search text-muted"></i>
                    <input type="text" placeholder="Search..." className={styles.searchInput} /> */}
                {/* </dl̥iv> */}

                <div className={styles.userProfile}>
                    <div className={styles.avatar}>A</div>
                    <div className={styles.userInfo}>
                        <span className={styles.userName}>Administrator</span>
                        <span className={styles.userRole}>Super Admin</span>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default AdminHeader;
