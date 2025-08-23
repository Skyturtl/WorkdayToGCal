import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import GClown from './assets/GClown.png';
import reportWebVitals from './reportWebVitals';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider } from './contexts/AuthContext';

// Public OAuth client ID (must be configured at build time). For GitHub Pages
// builds, ensure REACT_APP_GOOGLE_CLIENT_ID is present in a .env file. The
// client secret should NEVER be in the frontend bundle.
const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID || '';

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

const AppRoot = (
  <GoogleOAuthProvider clientId={clientId}>
    <AuthProvider>
      <App />
    </AuthProvider>
  </GoogleOAuthProvider>
);

root.render(<React.StrictMode>{AppRoot}</React.StrictMode>);

// optional: measure performance
reportWebVitals(console.log);
