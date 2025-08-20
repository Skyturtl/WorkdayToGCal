import React from 'react';

// Simple presentational dropdown for calendars
const CalendarDropdown = ({ items = [], selectedId = '', onChange, className }) => {
  return (
    <select
      value={selectedId}
      onChange={(e) => onChange(e.target.value)}
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
