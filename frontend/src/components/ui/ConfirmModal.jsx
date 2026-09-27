import React from 'react';
import ReactDOM from 'react-dom';
import styles from './ConfirmModal.module.css';

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message, confirmText = "Confirm", cancelText = "Cancel", icon = "fas fa-question-circle" }) => {
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContainer} onClick={(e) => e.stopPropagation()}>
        <div className={styles.iconWrapper}>
          <i className={icon}></i>
        </div>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.message}>{message}</p>
        <div className={styles.actions}>
          <button className={styles.btnCancel} onClick={onClose}>
            {cancelText}
          </button>
          <button className={styles.btnConfirm} onClick={() => { onConfirm(); onClose(); }}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ConfirmModal;
