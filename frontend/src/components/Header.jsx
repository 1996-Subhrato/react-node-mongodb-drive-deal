import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import useAuthStore from '../store/authStore';
import styles from './Header.module.css';

const Header = () => {
    const { isAuthenticated, role } = useAuthStore();
    const { logout } = useAuth();
    const location = useLocation();
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const isHomePage = location.pathname === '/';

    return (
        <header className={`${styles.header} ${scrolled || !isHomePage ? styles.headerActive : ''}`}>
            <div className={styles.container}>
                {/* Logo Area */}
                <div className={styles.logoArea}>
                    <Link to="/" onClick={() => setMobileMenuOpen(false)} style={{ textDecoration: 'none' }}>
                        <img
                            src="/assets/img/new_drive_deal_logo.png"
                            alt="Drive Deal"
                            className={styles.logo}
                        />
                    </Link>
                </div>

                {/* Desktop Navigation Links */}
                <nav className={styles.nav}>
                    <ul className={styles.navLinks}>
                        <li>
                            <Link to="/" className={`${styles.navLink} ${!scrolled && isHomePage ? styles.navLinkLight : ''}`}>
                                Home
                            </Link>
                        </li>
                        <li>
                            <Link to="/about" className={`${styles.navLink} ${!scrolled && isHomePage ? styles.navLinkLight : ''}`}>
                                About
                            </Link>
                        </li>
                        <li>
                            <Link to="/cars" className={`${styles.navLink} ${!scrolled && isHomePage ? styles.navLinkLight : ''}`}>
                                Marketplace
                            </Link>
                        </li>
                        <li>
                            <Link to="/compare" className={`${styles.navLink} ${!scrolled && isHomePage ? styles.navLinkLight : ''}`}>
                                Compare
                            </Link>
                        </li>
                        <li>
                            <Link to="/contact" className={`${styles.navLink} ${!scrolled && isHomePage ? styles.navLinkLight : ''}`}>
                                Contact
                            </Link>
                        </li>
                    </ul>

                    {/* Auth Area (Desktop) */}
                    <div className={`${styles.authArea} ${styles.desktopOnly}`}>
                        {!isAuthenticated ? (
                            <>
                                <button className={styles.btnAccount}>
                                    ACCOUNT <i className="fas fa-chevron-down"></i>
                                </button>
                                <div className={styles.dropdown}>
                                    <Link to="/user/login" className={styles.dropdownLink}>
                                        <i className="fas fa-user me-2"></i> Buyer Login
                                    </Link>
                                    <Link to="/seller/login" className={styles.dropdownLink}>
                                        <i className="fas fa-store me-2"></i> Seller Login
                                    </Link>
                                </div>
                            </>
                        ) : (
                            <Link to={`/${role || 'user'}/dashboard`} className={styles.btnAccount}>
                                DASHBOARD <i className="fas fa-th-large"></i>
                            </Link>
                        )}
                    </div>

                    {/* Mobile Toggle */}
                    <button
                        className={styles.mobileToggle}
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        aria-label="Toggle Menu"
                    >
                        <i className={`fas ${mobileMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
                    </button>
                </nav>
            </div>

            {/* Mobile Menu Overlay */}
            <div className={`${styles.mobileOverlay} ${mobileMenuOpen ? styles.mobileOverlayOpen : ''}`}>
                <nav className={styles.mobileNav}>
                    <Link to="/" className={styles.mobileNavLink} onClick={() => setMobileMenuOpen(false)}>Home</Link>
                    <Link to="/about" className={styles.mobileNavLink} onClick={() => setMobileMenuOpen(false)}>About</Link>
                    <Link to="/cars" className={styles.mobileNavLink} onClick={() => setMobileMenuOpen(false)}>Marketplace</Link>
                    <Link to="/compare" className={styles.mobileNavLink} onClick={() => setMobileMenuOpen(false)}>Compare</Link>
                    <Link to="/contact" className={styles.mobileNavLink} onClick={() => setMobileMenuOpen(false)}>Contact</Link>

                    <div className={styles.mobileAuthArea}>
                        {!isAuthenticated ? (
                            <>
                                <Link to="/user/login" className={styles.mobileAuthBtn} onClick={() => setMobileMenuOpen(false)}>Buyer Login</Link>
                                <Link to="/seller/login" className={`${styles.mobileAuthBtn} ${styles.btnPrimary}`} onClick={() => setMobileMenuOpen(false)}>Seller Login</Link>
                            </>
                        ) : (
                            <Link to={`/${role || 'user'}/dashboard`} className={styles.mobileAuthBtn} onClick={() => setMobileMenuOpen(false)}>Dashboard</Link>
                        )}
                    </div>
                </nav>
            </div>
        </header>
    );
};

export default Header;
