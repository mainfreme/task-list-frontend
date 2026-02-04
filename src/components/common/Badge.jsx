import React from 'react';

const Badge = ({ color = 'primary', children, pill = false }) => {
  return (
    <span className={`badge ${pill ? 'rounded-pill' : ''} bg-${color}`}>
      {children}
    </span>
  );
};

export default Badge;
