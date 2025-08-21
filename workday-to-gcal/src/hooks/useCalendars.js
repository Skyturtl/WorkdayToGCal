import { useCallback, useEffect, useState } from 'react';
import { listCalendars as apiListCalendars } from '../utils/api';
import { sortCalendars } from '../utils/calendarHelpers';

const useCalendars = ({ apiKey, discoveryDocs, token } = {}) => {
  const [calendars, setCalendars] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      if (!token) throw new Error('token required to load calendars');

      const accessToken = token.access_token || token;

      if (window.gapi && window.gapi.client && window.gapi.client.calendar) {
        try {
          window.gapi.client.setToken({ access_token: accessToken });
        } catch (e) {
          // ignore
        }
        const res = await window.gapi.client.calendar.calendarList.list();
        setCalendars(sortCalendars(res.result.items || []));
      } else {
        const res = await apiListCalendars(accessToken);
        setCalendars(sortCalendars(res.items || res.result?.items || []));
      }
    } catch (e) {
      setError(e.message || String(e));
      setCalendars([]);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      load();
    }
  }, [load, token]);

  return { calendars, loading, error, reload: load };
};

export default useCalendars;

