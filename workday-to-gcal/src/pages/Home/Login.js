import React, { useState } from 'react';
import { useGoogleLogin, googleLogout } from '@react-oauth/google';
import GoogleLoginButton from "../../components/ui/GoogleLoginButton";
import GoogleLogoutButton from "../../components/ui/GoogleLogoutButton";
import axios from 'axios';

const Login = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const login = useGoogleLogin({
    scope: 'openid email profile https://www.googleapis.com/auth/calendar',
    ux_mode: 'popup',
    onSuccess: async (tokenResponse) => {
      setIsLoggedIn(true);
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
  };

  return (
    <div>
      <h1>Login</h1>
      {!isLoggedIn ? (
        <GoogleLoginButton onClick={() => login()} />
      ) : (
        <GoogleLogoutButton onLogoutSuccess={handleLogout} />
      )}
      <p style={{ marginTop: 8, color: '#555' }}>
        Status: {isLoggedIn ? 'Logged in' : 'Logged out'}
      </p>
    </div>
  );
};

export default Login;