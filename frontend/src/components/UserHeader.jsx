import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styles from './UserHeader.module.css';
import authService from '../services/authService';
import ConfirmModal from './ui/ConfirmModal';

const UserHeader = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const handleLogoutConfirm = async () => {
        await authService.userLogout();
        navigate('/user/login');
    };

    return (
        <>
            <header className={styles.header}>
                <div 
                    className={styles.profileSection} 
                    onClick={toggleDropdown}
                    ref={dropdownRef}
                >
                    <div className={styles.profileInfo}>
                        <span className={styles.profileName}>{user?.name || 'User'}</span>
                        <span className={styles.profileRole}>{user?.email || 'Registered User'}</span>
                    </div>
                    <div className={styles.avatar}>
                        {user?.photo ? (
                            <img
                                src={user.photo.startsWith('http') ? user.photo : `http://localhost:5000${user.photo.startsWith('/') ? '' : '/'}${user.photo}`}
                                alt="Profile"
                                className={styles.avatarImg}
                                onError={(e) => {
                                    e.target.style.display = 'none';
                                    e.target.parentElement.innerText = user?.name?.charAt(0) || 'U';
                                }}
                            />
                        ) : (
                            user?.name?.charAt(0) || 'U'
                        )}
                    </div>

                    {/* Dropdown Menu */}
                    <div className={`${styles.dropdownMenu} ${isDropdownOpen ? styles.show : ''}`}>
                        <Link to="/user/change_password" className={styles.dropdownItem}>
                            <i className="fas fa-key"></i>
                            Change Password
                        </Link>
                        <Link to="/user/profile" className={styles.dropdownItem}>
                            <i className="fas fa-user-circle"></i>
                            My Profile
                        </Link>
                        <div className={styles.dropdownDivider}></div>
                        <button onClick={() => setIsLogoutModalOpen(true)} className={`${styles.dropdownItem} ${styles.logoutItem}`}>
                            <i className="fas fa-sign-out-alt"></i>
                            Logout
                        </button>
                    </div>
                </div>
            </header>

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

export default UserHeader;
