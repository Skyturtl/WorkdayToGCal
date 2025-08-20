// JavaScript version of Google Calendar API Quickstart logic for React
import React, { useEffect, useState } from 'react';

const CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;
const API_KEY = process.env.REACT_APP_API_KEY;
const DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest';
const SCOPES = 'https://www.googleapis.com/auth/calendar.readonly';

const GoogleCalendarQuickstart = () => {
  const [gapiInited, setGapiInited] = useState(false);
  const [gisInited, setGisInited] = useState(false);
  const [tokenClient, setTokenClient] = useState(null);
  const [content, setContent] = useState('');
  const [authVisible, setAuthVisible] = useState(false);
  const [signoutVisible, setSignoutVisible] = useState(false);
  const [authButtonText, setAuthButtonText] = useState('Authorize');

  useEffect(() => {
    // gapi script
    const gapiScript = document.createElement('script');
    gapiScript.src = 'https://apis.google.com/js/api.js';
    gapiScript.async = true;
    gapiScript.defer = true;
    gapiScript.onload = gapiLoaded;
    document.body.appendChild(gapiScript);

    // gis script
    const gisScript = document.createElement('script');
    gisScript.src = 'https://accounts.google.com/gsi/client';
    gisScript.async = true;
    gisScript.defer = true;
    gisScript.onload = gisLoaded;
    document.body.appendChild(gisScript);

    return () => {
      document.body.removeChild(gapiScript);
      document.body.removeChild(gisScript);
    };
    // eslint-disable-next-line
  }, []);

  function gapiLoaded() {
    window.gapi.load('client', initializeGapiClient);
  }

  async function initializeGapiClient() {
    await window.gapi.client.init({
      apiKey: API_KEY,
      discoveryDocs: [DISCOVERY_DOC],
    });
    setGapiInited(true);
  }

  function gisLoaded() {
    const client = window.google.accounts.oauth2.initTokenClient({
      client_id: CLIENT_ID,
      scope: SCOPES,
      callback: () => {},
    });
    setTokenClient(client);
    setGisInited(true);
  }

  useEffect(() => {
    if (gapiInited && gisInited) {
      setAuthVisible(true);
    }
  }, [gapiInited, gisInited]);

  const handleAuthClick = () => {
    if (!tokenClient) return;
    tokenClient.callback = async (resp) => {
      if (resp.error !== undefined) {
        throw resp;
      }
      setSignoutVisible(true);
      setAuthButtonText('Refresh');
      await listUpcomingEvents();
    };

    if (window.gapi.client.getToken() === null) {
      tokenClient.requestAccessToken({ prompt: 'consent' });
    } else {
      tokenClient.requestAccessToken({ prompt: '' });
    }
  };

  const handleSignoutClick = () => {
    const token = window.gapi.client.getToken();
    if (token !== null) {
      window.google.accounts.oauth2.revoke(token.access_token);
      window.gapi.client.setToken('');
      setContent('');
      setAuthButtonText('Authorize');
      setSignoutVisible(false);
    }
  };

  async function listUpcomingEvents() {
    let response;
    try {
      const request = {
        calendarId: 'primary',
        timeMin: new Date().toISOString(),
        showDeleted: false,
        singleEvents: true,
        maxResults: 10,
        orderBy: 'startTime',
      };
      response = await window.gapi.client.calendar.events.list(request);
    } catch (err) {
      setContent(err.message);
      return;
    }

    const events = response.result.items;
    if (!events || events.length === 0) {
      setContent('No events found.');
      return;
    }
    const output = events.reduce(
      (str, event) =>
        `${str}${event.summary} (${event.start.dateTime || event.start.date})\n`,
      'Events:\n'
    );
    setContent(output);
  }

  return (
    <div>
      <p>Google Calendar API Quickstart</p>
      <button
        id="authorize_button"
        style={{ visibility: authVisible ? 'visible' : 'hidden' }}
        onClick={handleAuthClick}
      >
        {authButtonText}
      </button>
      <button
        id="signout_button"
        style={{ visibility: signoutVisible ? 'visible' : 'hidden' }}
        onClick={handleSignoutClick}
      >
        Sign Out
      </button>
      <pre id="content" style={{ whiteSpace: 'pre-wrap' }}>
        {content}
      </pre>
    </div>
  );
};

export default GoogleCalendarQuickstart;
