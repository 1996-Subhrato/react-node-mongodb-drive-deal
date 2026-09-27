import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Footer.module.css';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      {/* Decorative Glows */}
      <div className={styles.footerGlow1}></div>
      <div className={styles.footerGlow2}></div>

      <div className={styles.container}>
        <div className={styles.topSection}>
          <div className={styles.brandCol}>
            <Link to="/" className={styles.logoLink}>
              <img src="/assets/img/new_drive_deal_logo.png" alt="Drive Deal" className={styles.footerLogo} />
            </Link>
            <p className={styles.brandDesc}>
              Redefining the car rental experience through technology and trust. 
              Find your perfect ride or list your fleet today.
            </p>
            <div className={styles.socialGrid}>
              <a href="#" className={styles.socialItem}><i className="fab fa-facebook-f"></i></a>
              <a href="#" className={styles.socialItem}><i className="fab fa-twitter"></i></a>
              <a href="#" className={styles.socialItem}><i className="fab fa-instagram"></i></a>
              <a href="#" className={styles.socialItem}><i className="fab fa-linkedin-in"></i></a>
            </div>
          </div>

          <div className={styles.linkCol}>
            <h4 className={styles.colTitle}>Quick Links</h4>
            <ul className={styles.footerLinks}>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/cars">Explore Fleet</Link></li>
              <li><Link to="/about">Our Model</Link></li>
              <li><Link to="/contact">Support</Link></li>
            </ul>
          </div>

          <div className={styles.linkCol}>
            <h4 className={styles.colTitle}>For Partners</h4>
            <ul className={styles.footerLinks}>
              <li><Link to="/dealer/login">Dealer Login</Link></li>
              <li><Link to="/dealer/signup">Join as Dealer</Link></li>
              <li><Link to="/admin/login">Admin Access</Link></li>
            </ul>
          </div>

          <div className={styles.contactCol}>
            <h4 className={styles.colTitle}>Get In Touch</h4>
            <div className={styles.contactList}>
              <div className={styles.contactItem}>
                <div className={styles.contactIcon}><i className="fas fa-envelope"></i></div>
                <div className={styles.contactInfo}>
                  <span>Email Support</span>
                  <p>support@drivedeal.com</p>
                </div>
              </div>
              <div className={styles.contactItem}>
                <div className={styles.contactIcon}><i className="fas fa-phone-alt"></i></div>
                <div className={styles.contactInfo}>
                  <span>Call Anytime</span>
                  <p>+1 (555) 000-1234</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.bottomBar}>
          <div className={styles.copyright}>
            © {new Date().getFullYear()} <span className={styles.brandName}>Drive Deal</span>. All rights reserved.
          </div>
          <div className={styles.legalLinks}>
            <a href="#">Privacy Policy</a>
            <div className={styles.dot}></div>
            <a href="#">Terms of Service</a>
            <div className={styles.dot}></div>
            <a href="#">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
