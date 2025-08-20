import React from 'react';
import Button from './Button';

// Presentational button - DO NOT forward arbitrary props to the DOM.
const GoogleLoginButton = ({ onClick, children = 'Login with Google' }) => (
  <Button onClick={onClick}>{children}</Button>
);

export default GoogleLoginButton;