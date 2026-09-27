import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styles from './AdminSidebar.module.css';
import ConfirmModal from './ui/ConfirmModal';

const AdminSidebar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { logout } = useAuth();
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

    const menuItems = [
        { path: '/admin/dashboard', label: 'Dashboard', icon: 'fas fa-th-large' },
        { path: '/admin/manage_sellers', label: 'Manage Sellers', icon: 'fas fa-users' },
        { path: '/admin/manage_categories', label: 'Categories', icon: 'fas fa-tags' },
        { path: '/admin/view_purchase_requests', label: 'Marketplace', icon: 'fas fa-hand-holding-usd' },
        { path: '/admin/change_password', label: 'Security', icon: 'fas fa-lock' },
    ];

    const handleLogoutConfirm = async () => {
        await logout();
        navigate('/admin/login');
    };

    return (
        <>
            <aside className={styles.sidebar}>
                <div className={styles.logo}>
                    <Link to="/admin/dashboard" style={{ textDecoration: 'none' }}>
                        <img src="/assets/img/new_drive_deal_logo.png" alt="Drive Deal" className={styles.logoImg} />
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
                message="Are you sure you want to log out of the admin panel?"
                confirmText="Logout"
                cancelText="Stay"
                icon="fas fa-sign-out-alt"
            />
        </>
    );
};

export default AdminSidebar;
