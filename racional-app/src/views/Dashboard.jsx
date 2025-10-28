import React from 'react';
import { usePortfolioStream } from '../hooks/usePortfolioStream';
import PortfolioChart from '../components/Chart/PortfolioChart';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import ErrorMessage from '../components/UI/ErrorMessage';
import DashboardStats from '../components/UI/DashboardStats';
import DailyReturnChart from '../components/Chart/DailyReturnChart';

const Dashboard = () => {
  const { data, loading, error } = usePortfolioStream();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  const latestDataPoint = data && data.length > 0 ? data[data.length -1] : null;

  // 3. Si hay datos y no hay carga ni error, mostramos la gráfica
  return (
    <div className="dashboard-view">
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