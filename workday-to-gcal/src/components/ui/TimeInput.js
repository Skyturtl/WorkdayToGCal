import React from 'react';

const TimeInput = ({ value = '', onChange, style = {}, ...props }) => {
  const base = { padding: 6, borderRadius: 4, border: '1px solid #ddd', width: 110 };
  return (
    <input
      type="time"
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
      style={{ ...base, ...style }}
      {...props}
    />
  );
};

export default TimeInput;
