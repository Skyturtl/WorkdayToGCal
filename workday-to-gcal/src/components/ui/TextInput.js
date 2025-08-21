import React from 'react';

const TextInput = ({ value, onChange, placeholder = '', disabled = false, style = {} }) => {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
      placeholder={placeholder}
      disabled={disabled}
      style={{ padding: '8px 10px', border: '1px solid #ccc', borderRadius: 4, ...style }}
    />
  );
};

export default TextInput;
