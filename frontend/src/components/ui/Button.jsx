import React from 'react';

const Button = ({ children, onClick, type = 'button', variant = 'primary', className = '', style = {} }) => {
  const baseStyle = {
    padding: '0.8rem 1.5rem',
    borderRadius: '8px',
    fontWeight: '600',
    transition: 'all 0.2s ease',
    cursor: 'pointer',
    border: 'none',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    textDecoration: 'none',
  };

  const variants = {
    primary: {
      background: '#0046E2',
      color: '#ffffff',
    },
    secondary: {
      background: '#f0f4ff',
      color: '#0046E2',
    },
    outline: {
      background: 'transparent',
      border: '2px solid #0046E2',
      color: '#0046E2',
    },
    danger: {
      background: '#ef4444',
      color: '#ffffff',
    },
  };

  const combinedStyle = { ...baseStyle, ...variants[variant], ...style };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`custom-btn ${className}`}
      style={combinedStyle}
    >
      {children}
    </button>
  );
};

export default Button;
