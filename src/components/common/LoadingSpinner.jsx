import React from 'react';

const LoadingSpinner = ({ message = 'Ładowanie...', size = 'md' }) => {
  const spinnerSize = size === 'sm' ? 'spinner-border-sm' : size === 'lg' ? 'spinner-border-lg' : '';
  
  return (
    <div className="d-flex flex-column align-items-center justify-content-center my-5">
      <div className={`spinner-border text-primary ${spinnerSize}`} role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
      {message && <p className="mt-2 text-muted small">{message}</p>}
    </div>
  );
};

export default LoadingSpinner;
