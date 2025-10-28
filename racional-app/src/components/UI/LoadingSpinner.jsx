import React from 'react';
import './LoadingSpinner.css'; // Crearemos este CSS

const LoadingSpinner = () => (
  <div className="spinner-container">
    <div className="loading-spinner"></div>
    <p>Cargando datos...</p>
  </div>
);

export default LoadingSpinner;