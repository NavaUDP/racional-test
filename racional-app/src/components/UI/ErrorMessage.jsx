import React from 'react';
import './ErrorMessage.css'; // Crearemos este CSS

const ErrorMessage = ({ message }) => (
  <div className="error-container">
    <strong>Error:</strong>
    <p>{message || 'Ha ocurrido un error inesperado.'}</p>
  </div>
);

export default ErrorMessage;