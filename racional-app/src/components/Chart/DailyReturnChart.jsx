import React, { useState, useMemo } from 'react'; // 1. Importamos useState y useMemo
import { Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
} from 'chart.js';
import 'chartjs-adapter-date-fns';
// 2. Importamos funciones de date-fns
import { subMonths, subWeeks, isAfter } from 'date-fns'; 
import './DailyReturnChart.css';

// Registramos todos los elementos
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
);

// Colores
const COLOR_GREEN = 'rgba(39, 174, 96, 0.7)';
const COLOR_RED = 'rgba(231, 76, 60, 0.7)';
const COLOR_BLUE = 'rgba(52, 152, 219, 0.8)';

const DailyReturnChart = ({ data }) => {
  // Estado para el tipo de gráfico (barra/línea)
  const [chartType, setChartType] = useState('bar');
  
  // 3. NUEVO ESTADO: Para el rango de fechas
  const [dateRange, setDateRange] = useState('3m'); // 'all', '6m', '3m', '2w'

  // 4. LÓGICA DE FILTRADO
  // Usamos useMemo para que esto no se recalcule en cada render,
  // solo si 'data' (del hook) o 'dateRange' (de nuestro estado) cambian.
  const filteredData = useMemo(() => {
    // El componente solo se renderiza si data.length > 0 (visto en Dashboard.jsx)
    // por lo que es seguro acceder al último elemento.
    const endDate = data[data.length - 1].date;
    let cutoffDate = null;

    switch (dateRange) {
      case '6m':
        cutoffDate = subMonths(endDate, 6);
        break;
      case '3m':
        cutoffDate = subMonths(endDate, 3);
        break;
      case '2w':
        cutoffDate = subWeeks(endDate, 2);
        break;
      case 'all':
      default:
        return data; // Devuelve todos los datos
    }

    // Filtramos los datos para incluir solo fechas POSTERIORES a la fecha de corte
    return data.filter(item => isAfter(item.date, cutoffDate));
  }, [data, dateRange]); // Dependencias del useMemo

  
  // 5. DEFINICIÓN DE GRÁFICOS (Ahora usan 'filteredData')
  
  // --- Datos para Gráfico de Barras ---
  const barChartData = {
    labels: filteredData.map(item => item.date), // Usamos filteredData
    datasets: [
      {
        label: 'Retorno Diario',
        data: filteredData.map(item => item.dailyReturn), // Usamos filteredData
        backgroundColor: (context) => {
          const value = context.raw;
          return value >= 0 ? COLOR_GREEN : COLOR_RED;
        },
      },
    ],
  };

  // --- Datos para Gráfico de Línea ---
  const lineChartData = {
    labels: filteredData.map(item => item.date), // Usamos filteredData
    datasets: [
      {
        label: 'Retorno Diario',
        data: filteredData.map(item => item.dailyReturn), // Usamos filteredData
        borderColor: COLOR_BLUE,
        backgroundColor: 'rgba(52, 152, 219, 0.1)',
        fill: true,
        tension: 0.1,
        pointRadius: 2,
        pointHoverRadius: 4,
      },
    ],
  };

  // --- Opciones Comunes (no cambian) ---
  const commonTooltip = {
    callbacks: {
      label: function(context) {
        let label = context.dataset.label || '';
        if (label) {
          label += ': ';
        }
        if (context.parsed.y !== null) {
          label += new Intl.NumberFormat('es-CL', {
            style: 'percent',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
            signDisplay: 'always',
          }).format(context.parsed.y);
        }
        return label;
      }
    }
  };

  const commonScales = {
    x: {
      type: 'time',
      time: { unit: 'day', displayFormats: { day: 'dd MMM' } },
      grid: { display: false },
    },
    y: {
      title: { display: true, text: 'Retorno (%)' },
      ticks: {
         callback: function(value) {
             return (value * 100).toFixed(1) + '%';
         }
      }
    },
  };

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: { display: true, text: 'Retornos Diarios', font: { size: 18 } },
      tooltip: commonTooltip,
    },
    scales: commonScales,
  };
  
  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: { display: true, text: 'Retornos Diarios', font: { size: 18 } },
      tooltip: { ...commonTooltip, mode: 'index', intersect: false, },
    },
    scales: commonScales,
  };

  // --- 6. RENDERIZADO FINAL (con los nuevos botones) ---
  return (
    <div className="chart-container">
      
      {/* --- Toggle de Tipo de Gráfico (Existente) --- */}
      <div className="chart-toggle">
        <button
          onClick={() => setChartType('line')}
          className={chartType === 'line' ? 'active' : ''}
        >
          Línea
        </button>
        <button
          onClick={() => setChartType('bar')}
          className={chartType === 'bar' ? 'active' : ''}
        >
          Barra
        </button>
      </div>

      {/* --- Gráfico (Render Condicional) --- */}
      {chartType === 'line' ? (
        <Line options={lineChartOptions} data={lineChartData} />
      ) : (
        <Bar options={barChartOptions} data={barChartData} />
      )}

      {/* --- 7. NUEVO TOGGLE: Rango de Fechas --- */}
      <div className="date-range-toggle">
        <button onClick={() => setDateRange('2w')} className={dateRange === '2w' ? 'active' : ''}>
          2S
        </button>
        <button onClick={() => setDateRange('3m')} className={dateRange === '3m' ? 'active' : ''}>
          3M
        </button>
        <button onClick={() => setDateRange('6m')} className={dateRange === '6m' ? 'active' : ''}>
          6M
        </button>
        <button onClick={() => setDateRange('all')} className={dateRange === 'all' ? 'active' : ''}>
          Todo
        </button>
      </div>
    </div>
  );
};

export default DailyReturnChart;