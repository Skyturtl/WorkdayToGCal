import { useCallback, useState } from 'react';
import { deleteEvent as apiDeleteEvent } from '../utils/api';

const useDeleteEvent = ({ token } = {}) => {
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState(null);

  const deleteEvent = useCallback(async (eventId) => {
    setDeleting(true);
    setError(null);
    try {
      if (!token) throw new Error('token required to delete event');
      let calendarId = '';
      try { calendarId = localStorage.getItem('selectedCalendarId') || ''; } catch {}
      if (!calendarId) throw new Error('Select a calendar first');
      const accessToken = token.access_token || token;

      if (window.gapi && window.gapi.client && window.gapi.client.calendar) {
        try { window.gapi.client.setToken({ access_token: accessToken }); } catch {}
        await window.gapi.client.calendar.events.delete({ calendarId, eventId });
      } else {
        await apiDeleteEvent(calendarId, accessToken, eventId);
      }
      return true;
    } catch (e) {
      setError(e.message || String(e));
      throw e;
    } finally {
      setDeleting(false);
    }
  }, [token]);

  return { deleteEvent, deleting, error };
};

export default useDeleteEvent;
