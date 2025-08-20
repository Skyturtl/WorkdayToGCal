import React from 'react';

// Presentational button - DO NOT forward arbitrary props to the DOM.
const GoogleLoginButton = ({ onClick, children = 'Login with Google', className }) => {
  return (
    <button type="button" onClick={onClick} className={className}>
      {children}
    </button>
  );
};

export default GoogleLoginButton;