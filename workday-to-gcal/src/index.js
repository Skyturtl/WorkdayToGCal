import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import GClown from './assets/GClown.png';
import reportWebVitals from './reportWebVitals';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider } from './contexts/AuthContext';

const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;

const root = ReactDOM.createRoot(document.getElementById('root'));

// Dynamically set favicon to bundled GClown image (lives in src/assets)
try {
  const link = document.getElementById('dynamic-favicon') || document.createElement('link');
  link.id = 'dynamic-favicon';
  link.rel = 'icon';
  link.type = 'image/png';
  link.href = GClown;
  if (!link.parentNode) document.head.appendChild(link);
} catch (e) { /* ignore */ }

root.render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={clientId}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </GoogleOAuthProvider>
  </React.StrictMode>
);

// optional: measure performance
reportWebVitals(console.log);
