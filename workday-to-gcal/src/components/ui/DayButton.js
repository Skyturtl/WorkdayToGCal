import React from 'react';
import Button from './Button';

const DayButton = ({ label, active = false, onToggle, variant = 'weekday' }) => {
  const weekend = variant === 'weekend';
  const style = {
    marginLeft: 6,
    width: 28,
    height: 28,
    borderRadius: 6,
    padding: 0,
    fontWeight: 700,
    background: active ? '#f8bbd0' : (weekend ? '#fff5f8' : '#fff'),
    color: active ? '#c2185b' : '#333',
    border: active ? '1px solid #c2185b' : '1px solid #ddd'
  };

  return (
    <Button onClick={onToggle} aria-pressed={active} style={style} title={`Toggle ${label}`}>
      {label}
    </Button>
  );
};

export default DayButton;
