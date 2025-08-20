import { useCallback, useState } from 'react';
import { createCalendar as apiCreateCalendar } from '../utils/api';

// Hook to create a new calendar for the authenticated user
// Usage: const { createCalendar, creating, error, created } = useCreateCalendar({ token })
const useCreateCalendar = ({ token } = {}) => {
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState(null);
  const [created, setCreated] = useState(null); // last created calendar resource

  const createCalendar = useCallback(async ({ summary, timeZone, description } = {}) => {
    setCreating(true);
    setError(null);
    setCreated(null);
    try {
      if (!token) throw new Error('token required to create calendar');
      const accessToken = token.access_token || token;

      // Prefer gapi if available
      if (window.gapi && window.gapi.client && window.gapi.client.calendar) {
        try { window.gapi.client.setToken({ access_token: accessToken }); } catch (e) {}
        const res = await window.gapi.client.calendar.calendars.insert({
          resource: {
            summary,
            timeZone,
            description,
          },
        });
        const resource = res.result || res;
        setCreated(resource);
        return resource;
      }

      // Fallback to REST helper
      const resource = await apiCreateCalendar(accessToken, { summary, timeZone, description });
      setCreated(resource);
      return resource;
    } catch (e) {
      setError(e.message || String(e));
      throw e;
    } finally {
      setCreating(false);
    }
  }, [token]);

  return { createCalendar, creating, error, created };
};

export default useCreateCalendar;
