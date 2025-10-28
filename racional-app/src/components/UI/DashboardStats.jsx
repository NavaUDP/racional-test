import React from 'react';
import './DashboardStats.css';

/**
 * Helper para formatear números a moneda (CLP en este ejemplo)
 */
const formatCurrency = (value) => {
  if (value === null || value === undefined) return 'N/A';
  // Asume CLP, que no usa decimales comúnmente.
  // Ajusta 'es-CL' y 'CLP' según la moneda que estés manejando.
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    maximumFractionDigits: 0, 
  }).format(value);
};

/**
 * Helper para formatear el retorno diario como porcentaje
 */
const formatPercentage = (value) => {
  if (value === null || value === undefined) return 'N/A';
  return new Intl.NumberFormat('es-CL', {
    style: 'percent',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    signDisplay: 'always', // Muestra siempre el signo '+' o '-'
  }).format(value);
};

const DashboardStats = ({ latestData }) => {
  // Si no hay datos, no renderizamos nada
  if (!latestData) {
    return null;
  }

  const { portfolioValue, contributions, dailyReturn } = latestData;

  // 1. Calcular la Ganancia/Pérdida Neta
  const netGain = portfolioValue - contributions;

  // 2. Determinar la clase CSS para el color (verde/rojo)
  const gainClass = netGain >= 0 ? 'positive' : 'negative';
  const returnClass = dailyReturn >= 0 ? 'positive' : 'negative';

  return (
    <div className="stats-container">
      {/* TARJETA 1: VALOR ACTUAL */}
      <div className="stat-card">
        <h3>Valor Actual</h3>
        <p className="main-value">{formatCurrency(portfolioValue)}</p>
      </div>

      {/* TARJETA 2: GANANCIA / PÉRDIDA NETA */}
      <div className="stat-card">
        <h3>Ganancia / Pérdida Neta</h3>
        <p className={`main-value ${gainClass}`}>{formatCurrency(netGain)}</p>
      </div>

      {/* TARJETA 3: CONTRIBUCIONES */}
      <div className="stat-card">
        <h3>Contribuciones Totales</h3>
        {/* Usamos 'sub-value' para darle menos énfasis que al valor actual */}
        <p className="sub-value">{formatCurrency(contributions)}</p>
      </div>

      {/* TARJETA 4: RETORNO DIARIO */}
      <div className="stat-card">
        <h3>Retorno Diario</h3>
        <p className={`main-value ${returnClass}`}>
          {formatPercentage(dailyReturn)}
        </p>
      </div>
    </div>
  );
};

export default DashboardStats;