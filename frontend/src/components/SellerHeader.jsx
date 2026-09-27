import React from 'react';
import { useAuth } from '../context/AuthContext';
import styles from './SellerHeader.module.css';

const SellerHeader = () => {
    const { user } = useAuth();

    return (
        <header className={styles.header}>
            <div className={styles.actionIcons}>
            </div>

            <div className={styles.profileSection}>
                <div className={styles.profileInfo}>
                    <span className={styles.profileName}>{user?.name || 'Seller'}</span>
                    <span className={styles.profileRole}>Verified Seller</span>
                </div>
                <div className={styles.avatar}>
                    {user?.photo ? (
                        <img
                            src={user.photo.startsWith('http') ? user.photo : `http://localhost:5000${user.photo.startsWith('/') ? '' : '/'}${user.photo}`}
                            alt="Profile"
                            className={styles.avatarImg}
                            onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.parentElement.innerText = user?.name?.charAt(0) || 'S';
                            }}
                        />
                    ) : (
                        user?.name?.charAt(0) || 'S'
                    )}
                </div>
            </div>
        </header>
    );
};

export default SellerHeader;
