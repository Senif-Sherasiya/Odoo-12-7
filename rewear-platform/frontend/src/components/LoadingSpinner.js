import React from 'react';
import { Spinner } from 'react-bootstrap';

const LoadingSpinner = ({ size = 'md', text = 'Loading...', variant = 'primary' }) => {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center p-4">
      <Spinner 
        animation="border" 
        variant={variant} 
        size={size}
        className="mb-3"
      />
      {text && (
        <p className="text-muted mb-0">{text}</p>
      )}
    </div>
  );
};

export default LoadingSpinner; 