// Minimal Google Calendar REST helpers (use fetch so these work in browser)
export async function listCalendars(accessToken) {
  if (!accessToken) throw new Error('Access token required');

  const res = await fetch('https://www.googleapis.com/calendar/v3/users/me/calendarList', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: 'application/json',
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || res.statusText || 'Failed to list calendars');
  }

  return res.json();
}

export async function getEvents(calendarId, accessToken, { timeMin, maxResults = 10 } = {}) {
  if (!accessToken) throw new Error('Access token required');
  const params = new URLSearchParams();
  if (timeMin) params.set('timeMin', timeMin);
  params.set('singleEvents', 'true');
  params.set('orderBy', 'startTime');
  params.set('maxResults', String(maxResults));

  const url = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events?${params.toString()}`;
  const res = await fetch(url, { headers: { Authorization: `Bearer ${accessToken}` } });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || res.statusText || 'Failed to fetch events');
  }
  return res.json();
}

// Create a brand new calendar for the authenticated user
export async function createCalendar(accessToken, { summary, timeZone, description } = {}) {
  if (!accessToken) throw new Error('Access token required');
  const res = await fetch('https://www.googleapis.com/calendar/v3/calendars', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({ summary, timeZone, description }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || res.statusText || 'Failed to create calendar');
  }
  return res.json();
}

// Create an event on a specific calendar
// body example: { summary, description, start: { dateTime, timeZone }, end: { dateTime, timeZone } }
export async function createEvent(calendarId, accessToken, body) {
  if (!accessToken) throw new Error('Access token required');
  if (!calendarId) throw new Error('calendarId required');
  const url = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(body || {}),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || res.statusText || 'Failed to create event');
  }
  return res.json();
}

// Delete an event (including a recurring master) by id
export async function deleteEvent(calendarId, accessToken, eventId) {
  if (!accessToken) throw new Error('Access token required');
  if (!calendarId) throw new Error('calendarId required');
  if (!eventId) throw new Error('eventId required');
  const url = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events/${encodeURIComponent(eventId)}`;
  const res = await fetch(url, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (res.status === 204) return { success: true };
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || res.statusText || 'Failed to delete event');
  }
  return { success: true };
}
