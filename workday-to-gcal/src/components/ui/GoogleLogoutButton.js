import React from 'react';
import { googleLogout } from '@react-oauth/google';
import Button from './Button';

// Stateless presentational logout button
const GoogleLogoutButton = ({ onLogoutSuccess, children = 'Logout' }) => {
  const handleClick = () => {
    try { googleLogout(); } catch (e) {}
    if (typeof onLogoutSuccess === 'function') onLogoutSuccess();
  };

  return (
    <Button onClick={handleClick} variant='outline'>
      {children}
    </Button>
  );
};

export default GoogleLogoutButton;