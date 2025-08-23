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

if (!clientId) {
  // Provide a clear runtime message in development / misconfigured prod build.
  // (In production GitHub Pages, this means the env var was not injected at build time.)
  // eslint-disable-next-line no-console
  console.error('Missing REACT_APP_GOOGLE_CLIENT_ID env variable. Google login disabled.');
}

const AppRoot = clientId ? (
  <GoogleOAuthProvider clientId={clientId}>
    <AuthProvider>
      <App />
    </AuthProvider>
  </GoogleOAuthProvider>
) : (
  <div style={{
    fontFamily: 'system-ui, sans-serif',
    padding: '2rem',
    maxWidth: 640,
    margin: '3rem auto',
    lineHeight: 1.5,
    color: '#333'
  }}>
    <h1 style={{ marginTop: 0 }}>Configuration Required</h1>
    <p>The application is missing the <code>REACT_APP_GOOGLE_CLIENT_ID</code>. Google Sign-In has been disabled.</p>
    <ol style={{ paddingLeft: '1.2rem' }}>
      <li>Create a <code>.env</code> file at the project root.</li>
      <li>Add: <code>REACT_APP_GOOGLE_CLIENT_ID=&lt;your-client-id.apps.googleusercontent.com&gt;</code></li>
      <li>Rebuild / redeploy: <code>npm run build</code> then your deploy script.</li>
    </ol>
    <p style={{ fontSize: '0.9em', color: '#666' }}>The client ID is public; do not include any client secret in frontend code.</p>
  </div>
);

root.render(<React.StrictMode>{AppRoot}</React.StrictMode>);

// optional: measure performance
reportWebVitals(console.log);
