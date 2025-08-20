import { useCallback, useState } from 'react';
import { createEvent as apiCreateEvent } from '../utils/api';

// Hook to create a new event in a calendar
// Usage: const { createEvent, creating, error, created } = useCreateEvent({ token })
const useCreateEvent = ({ token } = {}) => {
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState(null);
  const [created, setCreated] = useState(null);

  const createEvent = useCallback(async (calendarId, eventBody) => {
    setCreating(true);
    setError(null);
    setCreated(null);
    try {
      if (!token) throw new Error('token required to create event');
      const accessToken = token.access_token || token;

      if (window.gapi && window.gapi.client && window.gapi.client.calendar) {
        try { window.gapi.client.setToken({ access_token: accessToken }); } catch {}
        const res = await window.gapi.client.calendar.events.insert({ calendarId, resource: eventBody });
        const resource = res.result || res;
        setCreated(resource);
        return resource;
      }

      const resource = await apiCreateEvent(calendarId, accessToken, eventBody);
      setCreated(resource);
      return resource;
    } catch (e) {
      setError(e.message || String(e));
      throw e;
    } finally {
      setCreating(false);
    }
  }, [token]);

  return { createEvent, creating, error, created };
};

export default useCreateEvent;
