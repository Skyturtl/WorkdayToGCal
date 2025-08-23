import React from 'react';

const Button = ({ onClick, disabled = false, children, variant = 'primary', style = {}, title, ...rest }) => {
  const base = {
    padding: '8px 12px',
    borderRadius: 4,
    border: '1px solid transparent',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.6 : 1,
    fontWeight: 600,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center'
  };

  const variants = {
    primary: { background: '#e91e63', color: '#fff', border: '1px solid #b0003a' },
    outline: { background: '#fff', color: '#333', border: '1px solid #ccc' },
    success: { background: '#00c917', color: '#fff', border: '1px solid #008f12' },
    danger: { background: '#a4001d', color: '#fff', border: '1px solid #750015' },
  };

  return (
    <button onClick={disabled ? undefined : onClick} disabled={disabled} style={{ ...base, ...variants[variant], ...style }} title={title} {...rest}>
      {children}
    </button>
  );
};

export default Button;
