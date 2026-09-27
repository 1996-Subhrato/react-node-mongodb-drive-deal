import React from 'react';
import styles from './AboutSection.module.css';

const AboutSection = () => {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <span className={styles.subTitle}>Our Core Ecosystem</span>
          <h2 className={styles.title}>
            The Business Model <br />
            <span className={styles.highlight}>Connecting Sellers & Buyers</span>
          </h2>
          <p className={styles.headerDesc}>
            Drive Deal bridges the gap between premium vehicle sellers and modern buyers through a secure, 
            transparent, and technology-driven automotive marketplace.
          </p>
        </div>

        <div className={styles.modelGrid}>
          {/* Seller Path */}
          <div className={styles.pathCard}>
            <div className={styles.cardHeader}>
              <div className={styles.iconBox}>
                <i className="fas fa-store-alt"></i>
              </div>
              <div className={styles.headerText}>
                <h3>For Car Sellers</h3>
                <p>Empower your business</p>
              </div>
            </div>
            
            <div className={styles.steps}>
              <div className={styles.stepItem}>
                <div className={styles.stepNum}>01</div>
                <div className={styles.stepContent}>
                  <h4>Verified Onboarding</h4>
                  <p>Register as a certified seller with secure KYC verification.</p>
                </div>
              </div>
              <div className={styles.stepItem}>
                <div className={styles.stepNum}>02</div>
                <div className={styles.stepContent}>
                  <h4>Inventory Control</h4>
                  <p>List your premium vehicles with high-res photos and detailed specs.</p>
                </div>
              </div>
              <div className={styles.stepItem}>
                <div className={styles.stepNum}>03</div>
                <div className={styles.stepContent}>
                  <h4>Smart Management</h4>
                  <p>Accept purchase requests and manage sales through an advanced dashboard.</p>
                </div>
              </div>
            </div>
            
            <div className={styles.cardFooter}>
              <div className={styles.statMini}>
                <span className={styles.statLabel}>Revenue Growth</span>
                <span className={styles.statVal}>+40%</span>
              </div>
            </div>
          </div>

          {/* Connection Visual */}
          <div className={styles.connectorArea}>
            <div className={styles.pulseLine}></div>
            <div className={styles.centerLogo}>
              {/* <img src="/assets/img/admin_logo.png" alt="Drive Deal" /> */}
              <div className={styles.logoText}>DRIVE DEAL</div>
            </div>
          </div>

          {/* User Path */}
          <div className={`${styles.pathCard} ${styles.userCard}`}>
            <div className={styles.cardHeader}>
              <div className={styles.iconBox}>
                <i className="fas fa-user-tie"></i>
              </div>
              <div className={styles.headerText}>
                <h3>For Car Buyers</h3>
                <p>Find your perfect drive</p>
              </div>
            </div>
            
            <div className={styles.steps}>
              <div className={styles.stepItem}>
                <div className={styles.stepNum}>01</div>
                <div className={styles.stepContent}>
                  <h4>Seamless Discovery</h4>
                  <p>Browse a wide variety of verified cars from trusted sellers.</p>
                </div>
              </div>
              <div className={styles.stepItem}>
                <div className={styles.stepNum}>02</div>
                <div className={styles.stepContent}>
                  <h4>Instant Requests</h4>
                  <p>Send purchase requests directly to sellers with transparent pricing.</p>
                </div>
              </div>
              <div className={styles.stepItem}>
                <div className={styles.stepNum}>03</div>
                <div className={styles.stepContent}>
                  <h4>Secure Purchase</h4>
                  <p>Finalize your purchase securely with verified sellers.</p>
                </div>
              </div>
            </div>

            <div className={styles.cardFooter}>
              <div className={styles.statMini}>
                <span className={styles.statLabel}>Total Freedom</span>
                <span className={styles.statVal}>Unlimited</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
