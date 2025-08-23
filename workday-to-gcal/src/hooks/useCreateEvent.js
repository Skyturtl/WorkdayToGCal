import { useCallback, useState } from 'react';
import { createEvent as apiCreateEvent } from '../utils/api';
import { buildEventResource } from '../data/eventBuilder';

const NUM_TO_BYDAY = ['MO','TU','WE','TH','FR','SA','SU'];

const useCreateEvent = ({ token } = {}) => {
	const [creating, setCreating] = useState(false);
	const [error, setError] = useState(null);
	const [lastCreated, setLastCreated] = useState(null);

	const createEvent = useCallback(async (row) => {
		if (!row) return null;
		setCreating(true);
		setError(null);
		setLastCreated(null);
		try {
			if (!token) throw new Error('token required to create event');
			const accessToken = token.access_token || token; // accept raw token or token object

			// Selected calendar id persisted by CalendarDropdown
			let calendarId = '';
			try { calendarId = localStorage.getItem('selectedCalendarId') || ''; } catch (e) {}
			if (!calendarId) throw new Error('Select a calendar first');

			// Build recurrence + start/end using existing eventBuilder util for consistency
			const byDay = (row.days || [])
				.map(i => NUM_TO_BYDAY[i])
				.filter(Boolean);

			const resource = buildEventResource({
				title: row.title,
				location: row.room,
				startDate: row.startDate,
				startTime: row.startTime,
				endDate: row.startDate, // same day occurrence (end time defines duration)
				endTime: row.endTime,
				daysOfWeek: byDay,
				repeatUntil: row.endDate, // final date across recurrence
			});

			if (!resource.start || !resource.end) {
				throw new Error('Missing start or end date/time');
			}
			if (!resource.recurrence || !resource.recurrence.length) {
				throw new Error('At least one day of week required');
			}

			let created;
			if (window.gapi && window.gapi.client && window.gapi.client.calendar) {
				try { window.gapi.client.setToken({ access_token: accessToken }); } catch (e) {}
				const res = await window.gapi.client.calendar.events.insert({
					calendarId,
					resource,
				});
				created = res.result || res;
			} else {
				created = await apiCreateEvent(calendarId, accessToken, resource);
			}
			setLastCreated(created);
			return created;
		} catch (e) {
			setError(e.message || String(e));
			throw e;
		} finally {
			setCreating(false);
		}
	}, [token]);

	return { createEvent, creating, error, lastCreated };
};

export default useCreateEvent;
