import React from 'react';

// Un spinner simple con CSS inline para no crear más archivos
export const LoadingSpinner = () => {
  const style = {
    border: '5px solid rgba(0, 0, 0, 0.1)',
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    borderLeftColor: '#007aff', // Un azul Racional ;)
    animation: 'spin 1s ease infinite',
    margin: '40px auto'
  };
  const keyframes = `@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`;

  return (
    <>
      <style>{keyframes}</style>
      <div style={style} />
      <p style={{ textAlign: 'center' }}>Cargando portafolio...</p>
    </>
  );
};