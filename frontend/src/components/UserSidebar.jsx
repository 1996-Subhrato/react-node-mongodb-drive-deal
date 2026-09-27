import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styles from './UserSidebar.module.css';
import ConfirmModal from './ui/ConfirmModal';

const UserSidebar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { logout } = useAuth();
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

    const menuItems = [
        { path: '/user/dashboard', label: 'Dashboard', icon: 'fas fa-th-large' },
        { path: '/cars', label: 'Browse Cars', icon: 'fas fa-search' },
        { path: '/user/mypurchase_requests', label: 'My Garage', icon: 'fas fa-car' },
        { path: '/user/profile', label: 'Profile', icon: 'fas fa-user-circle' },
        // { path: '/user/change_password', label: 'Security', icon: 'fas fa-shield-halved' },
    ];

    const handleLogoutConfirm = async () => {
        await logout();
        navigate('/user/login');
    };

    return (
        <>
            <aside className={styles.sidebar}>
                <div className={styles.logo}>
                    <Link to="/user/dashboard" style={{ textDecoration: 'none' }}>
                        <div style={{ color: '#0f172a', fontSize: '1.5rem', fontWeight: 'bold' }}>
                            DRIVE <span style={{ color: '#f59e0b' }}>DEAL</span>
                        </div>
                    </Link>
                </div>

                <nav className={styles.nav}>
                    <ul className={styles.menuList}>
                        {menuItems.map((item) => (
                            <li key={item.path} className={styles.menuItem}>
                                <Link
                                    to={item.path}
                                    className={`${styles.menuLink} ${location.pathname === item.path ? styles.activeLink : ''}`}
                                >
                                    <i className={`${item.icon} ${styles.icon}`}></i>
                                    <span>{item.label}</span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>

                <div className={styles.footer}>
                    <button onClick={() => setIsLogoutModalOpen(true)} className={styles.logoutBtn}>
                        <i className={`fas fa-sign-out-alt ${styles.icon}`}></i>
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            <ConfirmModal
                isOpen={isLogoutModalOpen}
                onClose={() => setIsLogoutModalOpen(false)}
                onConfirm={handleLogoutConfirm}
                title="Logout Confirmation"
                message="Are you sure you want to log out of your account?"
                confirmText="Logout"
                cancelText="Stay"
                icon="fas fa-sign-out-alt"
            />
        </>
    );
};

export default UserSidebar;
