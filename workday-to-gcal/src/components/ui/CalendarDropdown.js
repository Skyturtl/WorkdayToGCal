import React from 'react';

const CalendarDropdown = ({ items = [], selectedId = '', onChange, className }) => {
  return (
    <select
      value={selectedId}
      onChange={(e) => {
        const v = e.target.value;
        onChange(v);
        try { localStorage.setItem('selectedCalendarId', v || ''); } catch (e) {}
        try { window.dispatchEvent(new CustomEvent('selectedCalendarIdChanged', { detail: v || '' })); } catch (e) {}
        // only mark calendarSelected true when a real calendar id is chosen (non-empty)
        const selectedFlag = Boolean(v && v !== '');
        try { localStorage.setItem('calendarSelected', selectedFlag ? 'true' : 'false'); } catch (e) {}
        try { window.dispatchEvent(new CustomEvent('calendarSelectedChanged', { detail: selectedFlag })); } catch (e) {}
      }}
      className={className}
      style={{ padding: '6px 8px', borderRadius: 6, border: '1px solid #ccc', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
    >
      <option value=""> -- Select calendar --</option>
      {items.map((cal) => (
        <option key={cal.id} value={cal.id}>
          {cal.summary || cal.id}
        </option>
      ))}
    </select>
  );
};

export default CalendarDropdown;
