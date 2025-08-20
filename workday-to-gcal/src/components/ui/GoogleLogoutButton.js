import React from 'react';
import { googleLogout } from '@react-oauth/google';

// Stateless presentational logout button
const GoogleLogoutButton = ({ onLogoutSuccess, children = 'Logout', className }) => {
  const handleClick = () => {
    try { googleLogout(); } catch (e) {}
    if (typeof onLogoutSuccess === 'function') onLogoutSuccess();
  };

  return (
    <button type="button" onClick={handleClick} className={className}>
      {children}
    </button>
  );
};

export default GoogleLogoutButton;