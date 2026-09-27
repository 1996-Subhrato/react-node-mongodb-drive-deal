import React from 'react';
import styles from './Loaders.module.css';

export const PageLoader = () => (
  <div className={styles.pageLoaderWrapper}>
    <div className={styles.loaderContent}>
      {/* Brand Logo */}
      <div className={styles.logoContainer}>
        <img 
          src="/assets/img/new_drive_deal_logo.png" 
          alt="Drive Deal" 
          className={styles.logoImg} 
        />
      </div>

      {/* Modern Spinner */}
      <div className={styles.spinnerContainer}>
        <div className={styles.spinner}></div>
        <div className={styles.spinnerInner}></div>
      </div>

      {/* Loading Text with Animated Dots */}
      <div className={styles.loadingText}>
        <span>Discovering</span>
        <div className={styles.dot}></div>
        <div className={styles.dot}></div>
        <div className={styles.dot}></div>
      </div>
    </div>
  </div>
);

export const Skeleton = ({ width = '100%', height = '1rem', borderRadius = '12px', className = '' }) => (
  <div
    className={`${styles.skeletonBase} ${className}`}
    style={{
      width,
      height,
      borderRadius,
    }}
  />
);

export const CarSkeleton = () => (
  <div className="card border-0 shadow-sm rounded-4 overflow-hidden mb-4" style={{ background: '#fff' }}>
    <Skeleton height="220px" borderRadius="0" />
    <div className="card-body p-4">
      <Skeleton width="75%" height="1.75rem" className="mb-3" />
      <Skeleton width="50%" height="1rem" className="mb-4" />
      <div className="d-flex gap-3">
        <Skeleton width="80px" height="2.5rem" borderRadius="10px" />
        <Skeleton width="100px" height="2.5rem" borderRadius="10px" />
      </div>
    </div>
  </div>
);
