import React from 'react';

const TaskFilter = ({ currentFilter, onFilterChange }) => {
  const filters = [
    { id: 'all', label: 'Wszystkie' },
    { id: 'pending', label: 'W toku' },
    { id: 'completed', label: 'Zakończone' },
  ];

  return (
    <div className="btn-group shadow-sm mb-4" role="group">
      {filters.map((filter) => (
        <button
          key={filter.id}
          type="button"
          className={`btn ${
            currentFilter === filter.id ? 'btn-primary' : 'btn-outline-primary'
          }`}
          onClick={() => onFilterChange(filter.id)}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
};

export default TaskFilter;
