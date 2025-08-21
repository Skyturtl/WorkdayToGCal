import { useEffect, useState, useCallback } from 'react';

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
    if (window.gapi && window.gapi.client) {
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
  }, [initClient]);

  return { ready, error };
};

export default useGapiClient;
