import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const saveToken = (tokenResp) => {
    setToken(tokenResp);
    setIsLoggedIn(!!tokenResp);
  };

  const clearToken = () => {
    setToken(null);
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ token, isLoggedIn, saveToken, clearToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};

export default AuthContext;
