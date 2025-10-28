import React from 'react';
import { usePortfolioStream } from '../hooks/usePortfolioStream';
import PortfolioChart from '../components/Chart/PortfolioChart';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import ErrorMessage from '../components/UI/ErrorMessage';

const Dashboard = () => {
  // 1. Llamamos al hook. Él se encarga de todo.
  const { data, loading, error } = usePortfolioStream();

  // 2. Renderizado condicional
  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  // 3. Si hay datos y no hay carga ni error, mostramos la gráfica
  return (
    <div className="dashboard-view">
      {/* Puedes agregar más elementos al dashboard aquí, 
        como un header, cards con el valor actual, etc.
      */}
      
      {data && data.length > 0 ? (
        <PortfolioChart data={data} />
      ) : (
        <ErrorMessage message="No se encontraron datos en el portafolio." />
      )}
    </div>
  );
};

export default Dashboard;