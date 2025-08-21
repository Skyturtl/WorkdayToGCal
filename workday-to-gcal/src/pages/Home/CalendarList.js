import React, { useState } from 'react';
import CalendarDropdown from '../../components/ui/CalendarDropdown';
import Button from '../../components/ui/Button';
import TextInput from '../../components/ui/TextInput';
import useGapiClient from '../../hooks/useGapiClient';
import useCalendars from '../../hooks/useCalendars';
import { useAuth } from '../../contexts/AuthContext';
import useCreateCalendar from '../../hooks/useCreateCalendar';

const API_KEY = process.env.REACT_APP_GOOGLE_API_KEY;
const DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest';

const CalendarList = ({ token: tokenProp } = {}) => {
  const [selected, setSelected] = useState('');
  const { token: ctxToken } = useAuth();

  const token = tokenProp || ctxToken;

  const { ready, error: gapiError } = useGapiClient({ apiKey: API_KEY, discoveryDocs: [DISCOVERY_DOC] });
  const { calendars, loading, error: calError, reload } = useCalendars({ token });
  const { createCalendar, creating: creatingCal } = useCreateCalendar({ token });

  const [newCalendarName, setNewCalendarName] = useState('');

  const handleCreateCalendar = async () => {
    if (!newCalendarName.trim()) return;
    try {
      await createCalendar({ summary: newCalendarName.trim() });
      setNewCalendarName('');
      await reload();
    } catch (e) {
    }
  };

  const error = gapiError || calError;

  return (
    <section className='calendar-list-section' id='calendars'>
      <h1>My Calendars</h1>
      {error && <div className="calendar-error">{error}</div>}
      {!ready && <div>Loading API...</div>}
      {!token && <div>Please sign in to view private calendars.</div>}
      {ready && token && (
        <div className='calendar-list'>
          <div className="grid calendar-dropdown">
            <CalendarDropdown items={calendars} selectedId={selected} onChange={setSelected} />
            <Button onClick={reload} variant='outline'>Refresh</Button>
          </div>
          <div className="grid calendar-create">
            <TextInput value={newCalendarName} onChange={setNewCalendarName} placeholder="New calendar name (e.g., Fall'25, Spring'26)" className="calendar-create-input" />
            <Button onClick={handleCreateCalendar} disabled={!newCalendarName.trim() || creatingCal}>Create Calendar</Button>
          </div>
        </div>
      )}
      {loading && <div>Loading calendars...</div>}
    </section>
  );
};

export default CalendarList;
