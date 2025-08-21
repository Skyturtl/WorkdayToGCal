import React from 'react';
import Button from './Button';

const GoogleLoginButton = ({ onClick, children = 'Login with Google' }) => (
  <Button onClick={onClick}>{children}</Button>
);

export default GoogleLoginButton;