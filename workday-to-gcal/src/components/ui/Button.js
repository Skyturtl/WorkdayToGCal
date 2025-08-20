import React from 'react';

// Presentational button component
// Props: onClick, disabled, children, variant
const Button = ({ onClick, disabled = false, children, variant = 'primary', style = {}, title }) => {
  const base = {
    padding: '8px 12px',
    borderRadius: 4,
    border: '1px solid transparent',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.6 : 1,
    fontWeight: 600,
  };

  const variants = {
    primary: { background: '#e91e63', color: '#fff' },
    outline: { background: '#fff', color: '#333', border: '1px solid #ccc' },
  };

  return (
    <button onClick={disabled ? undefined : onClick} disabled={disabled} style={{ ...base, ...variants[variant], ...style }} title={title}>
      {children}
    </button>
  );
};

export default Button;
