import React from 'react';
import { usePortfolioStream } from '../hooks/usePortfolioStream';
import { PortfolioChart } from '../components/Chart/PortfolioChart';
import { LoadingSpinner } from '../components/UI/LoadingSpinner';
import { ErrorMessage } from '../components/UI/ErrorMessage';

const Dashboard = () => {
  // 1. Llamamos a nuestro hook para conectarnos a 'user1'
  const { data, isLoading, error } = usePortfolioStream('user1');

  // 2. Función para decidir qué renderizar (Loading, Error o Gráfico)
  const renderContent = () => {
    if (isLoading) {
      return <LoadingSpinner />;
    }

    if (error) {
      return <ErrorMessage message={error.message} />;
    }

    // ¡¡MUY IMPORTANTE!!
    // Aquí asumimos que el documento 'user1' en Firestore
    // tiene un campo llamado 'timeSeries' que es un ARRAY
    // con el formato que espera el gráfico.
    // Si tu campo se llama 'historico' o 'puntos', cámbialo aquí.
    if (data && data.timeSeries) {
      return <PortfolioChart data={data.timeSeries} />;
    }

    // Si hay data pero no el campo 'timeSeries'
    return <p>El portafolio no tiene datos históricos para mostrar.</p>;
  };

  const containerStyle = {
    fontFamily: 'Arial, sans-serif',
    maxWidth: '900px',
    margin: '40px auto',
    padding: '20px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
    borderRadius: '10px'
  };
  
  const headerStyle = {
    borderBottom: '2px solid #f0f0f0',
    paddingBottom: '10px',
    color: '#333'
  };

  return (
    <div style={containerStyle}>
      <h1 style={headerStyle}>Evolución de tu Portafolio (En Tiempo Real)</h1>
      <div>
        {renderContent()}
      </div>
    </div>
  );
};

export default Dashboard;