import React from 'react';

const DateInput = ({ value = '', onChange, style = {}, ...props }) => {
  const base = { padding: 6, borderRadius: 4, border: '1px solid #ddd' };
  return (
    <input
      type="date"
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
      style={{ ...base, ...style }}
      {...props}
    />
  );
};

export default DateInput;
