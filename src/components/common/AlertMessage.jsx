import React from 'react';

const AlertMessage = ({ type = 'info', message, onClose }) => {
  if (!message) return null;

  return (
    <div className={`alert alert-${type} alert-dismissible fade show`} role="alert">
      {message}
      {onClose && (
        <button 
          type="button" 
          className="btn-close" 
          onClick={onClose} 
          aria-label="Close"
        ></button>
      )}
    </div>
  );
};

export default AlertMessage;
