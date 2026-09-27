import React from 'react';
import { Link } from 'react-router-dom';
import styles from './HeroSection.module.css';

const HeroSection = () => {
  return (
    <section className={styles.hero}>
      {/* Background elements */}
      <div className={styles.meshContainer}>
        <div className={styles.meshGradient}></div>
        <div className={styles.glassCircle1}></div>
        <div className={styles.glassCircle2}></div>
      </div>

      <div className={styles.container}>
        <div className={styles.grid}>
          <div className={styles.textContent}>
            <div className={styles.badgeWrapper}>
              <span className={styles.heroBadge}>
                <i className="fas fa-bolt"></i> Premium Car Marketplace
              </span>
            </div>
            
            <h1 className={styles.mainTitle}>
              Buy & Sell Premium Cars <br />
              With <span className={styles.gradientText}>Drive Deal</span>
            </h1>
            
            <p className={styles.subTitle}>
              The ultimate platform to buy your dream car or sell your current vehicle with confidence. 
              Connect with verified buyers and sellers in a secure, transparent marketplace.
            </p>

            <div className={styles.ctaGroup}>
              <Link to="/cars" className={styles.btnPrimary}>
                Browse Inventory
                <div className={styles.btnIcon}>
                  <i className="fas fa-arrow-right"></i>
                </div>
              </Link>
              <Link to="/about" className={styles.btnSecondary}>
                Learn More
              </Link>
            </div>

            <div className={styles.trustFooter}>
              <div className={styles.trustItem}>
                <div className={styles.trustIcon}><i className="fas fa-shield-alt"></i></div>
                <span>Certified Quality</span>
              </div>
              <div className={styles.trustDivider}></div>
              <div className={styles.trustItem}>
                <div className={styles.trustIcon}><i className="fas fa-user-tie"></i></div>
                <span>Verified Sellers</span>
              </div>
            </div>
          </div>

          <div className={styles.visualContent}>
            <div className={styles.imageCard}>
              <div className={styles.glowEffect}></div>
              <img 
                src="/assets/img/hero/marketplace_hero.png" 
                alt="Marketplace Hero" 
                className={styles.heroImg} 
              />
              
              {/* Floating feature tags */}
              <div className={`${styles.floatTag} ${styles.tag1}`}>
                <i className="fas fa-check-circle"></i>
                <span>Best Price</span>
              </div>
              <div className={`${styles.floatTag} ${styles.tag2}`}>
                <i className="fas fa-star"></i>
                <span>Premium Quality</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className={styles.scrollDown}>
        <div className={styles.mouse}>
          <div className={styles.wheel}></div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
