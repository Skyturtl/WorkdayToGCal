import React, { useState } from 'react';
import { useGoogleLogin, googleLogout } from '@react-oauth/google';
import GoogleLoginButton from "../../components/ui/GoogleLoginButton";
import GoogleLogoutButton from "../../components/ui/GoogleLogoutButton";
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';

const Login = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { saveToken, clearToken } = useAuth();

  const login = useGoogleLogin({
    scope: 'openid email profile https://www.googleapis.com/auth/calendar',
    ux_mode: 'popup',
    onSuccess: async (tokenResponse) => {
      setIsLoggedIn(true);
      saveToken(tokenResponse);
      console.log(tokenResponse);
      try {
        const userInfo = await axios.get(
          'https://www.googleapis.com/oauth2/v3/userinfo',
          { headers: { Authorization: `Bearer ${tokenResponse.access_token}` } },
        );
        console.log(userInfo);
      } catch (err) {
        console.error('Failed to fetch user info', err);
      }
    },
    onError: () => setIsLoggedIn(false),
    flow: 'implicit',
  });

  const handleLogout = () => {
    try { googleLogout(); } catch {}
    setIsLoggedIn(false);
    clearToken();
  };

  return (
    <section className='login-section' id='login'>
      <h1>Login</h1>
      {!isLoggedIn ? (
        <GoogleLoginButton onClick={() => login()} />
      ) : (
        <GoogleLogoutButton onLogoutSuccess={handleLogout} />
      )}
      <p className='login-status'>
        Status: {isLoggedIn ? 'Logged in' : 'Logged out'}
      </p>
    </section>
  );
};

export default Login;