import React from 'react';
// 1. YA NO importamos usePortfolioStream
import PortfolioChart from '../components/Chart/PortfolioChart';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import ErrorMessage from '../components/UI/ErrorMessage';
import DashboardStats from '../components/UI/DashboardStats';
import DailyReturnChart from '../components/Chart/DailyReturnChart';

// 2. Aceptamos 'data', 'loading' y 'error' como props
const Dashboard = ({ data, loading, error }) => {
  // 3. El hook ya no se llama aquí
  // const { data, loading, error } = usePortfolioStream();

  // El resto de la lógica es la misma
  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  const latestDataPoint = data && data.length > 0 ? data[data.length - 1] : null;

  return (
    <div className="dashboard-view">
      {/* Los componentes siguen funcionando igual con las props */}
      <DashboardStats latestData={latestDataPoint} />

      {data && data.length > 0 ? (
        <>
          <PortfolioChart data={data} />
          <DailyReturnChart data={data} />
        </>
      ) : (
        <ErrorMessage message="No se encontraron datos en el portafolio." />
      )}
    </div>
  );
};

export default Dashboard;