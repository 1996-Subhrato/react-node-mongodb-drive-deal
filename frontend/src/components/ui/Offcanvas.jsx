import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import styles from './Offcanvas.module.css';

const Offcanvas = ({ isOpen, onClose, title, children }) => {
  // Prevent scrolling when offcanvas is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const offcanvasContent = (
    <>
      <div 
        className={`${styles.overlay} ${isOpen ? styles.overlayOpen : ''}`} 
        onClick={onClose}
      />
      <div className={`${styles.container} ${isOpen ? styles.containerOpen : ''}`}>
        <div className={styles.header}>
          <h3 className={styles.title}>{title}</h3>
          <button className={styles.closeBtn} onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>
        <div className={styles.body}>
          {children}
        </div>
      </div>
    </>
  );

  return createPortal(offcanvasContent, document.body);
};

export default Offcanvas;

