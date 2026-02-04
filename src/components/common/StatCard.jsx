import React from 'react';

const StatCard = ({ title, value, icon: Icon, color = 'primary' }) => {
  return (
    <div className="card border-0 shadow-sm h-100">
      <div className="card-body d-flex align-items-center">
        <div className={`bg-${color} bg-opacity-10 p-3 rounded me-3`}>
          {Icon && <Icon className={`text-${color}`} size={24} />}
        </div>
        <div>
          <h6 className="card-subtitle mb-1 text-muted text-uppercase small fw-bold">{title}</h6>
          <h3 className="card-title mb-0 fw-bold">{value}</h3>
        </div>
      </div>
    </div>
  );
};

export default StatCard;
