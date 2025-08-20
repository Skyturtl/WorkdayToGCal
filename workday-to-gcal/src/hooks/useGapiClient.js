import { useEffect, useState, useCallback } from 'react';

// Loads gapi script and exposes an init function + ready flag.
// Usage: const { ready, initClient, error } = useGapiClient({ apiKey, discoveryDocs })
const useGapiClient = ({ apiKey, discoveryDocs = [] } = {}) => {
  const [ready, setReady] = useState(false);
  const [error, setError] = useState(null);

  const initClient = useCallback(async () => {
    if (!window.gapi) {
      setError('gapi not loaded');
      return;
    }

    try {
      await window.gapi.client.init({ apiKey, discoveryDocs });
      setReady(true);
    } catch (e) {
      setError(e.message || String(e));
    }
  }, [apiKey, discoveryDocs]);

  useEffect(() => {
    // If gapi already present, don't re-inject
    if (window.gapi && window.gapi.client) {
      // client might still need init
      initClient();
      return;
    }

  const script = document.createElement('script');
    script.src = 'https://apis.google.com/js/api.js';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      try {
        window.gapi.load('client', initClient);
      } catch (e) {
        setError(e.message || String(e));
      }
    };
    script.onerror = () => setError('Failed to load gapi script');
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initClient]);

  return { ready, error };
};

export default useGapiClient;
