import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale, // Importante para escalas de tiempo
} from 'chart.js';
import 'chartjs-adapter-date-fns'; // Importante para el adaptador de fechas
import './PortfolioChart.css';

// Registramos los componentes de Chart.js que vamos a usar
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale // Registramos la escala de tiempo
);

const PortfolioChart = ({ data }) => {
  // 1. Formateamos los datos para Chart.js
  const chartData = {
    // Usamos las fechas como etiquetas en el eje X
    labels: data.map(item => item.date),
    datasets: [
      {
        label: 'Valor del Portafolio ($)',
        data: data.map(item => item.portfolioValue),
        borderColor: 'rgb(75, 192, 192)',
        // ...
      }
    ],
  };

  // 2. Configuramos las opciones de la gráfica
  const options = {
    responsive: true,
    maintainAspectRatio: false, // Permite que el CSS defina la altura
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Evolución del Portafolio en Tiempo Real',
        font: {
          size: 18,
        },
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        callbacks: {
          // Formatear el tooltip para mostrar la moneda
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += new Intl.NumberFormat('es-CL', {
                style: 'currency',
                currency: 'CLP', // Puedes cambiar esto a USD si lo prefieres
              }).format(context.parsed.y);
            }
            return label;
          }
        }
      }
    },
    scales: {
      x: {
        // Le decimos a Chart.js que el eje X es una escala de tiempo
        type: 'time',
        time: {
          unit: 'day', // Agrupar por día
          tooltipFormat: 'dd/MM/yyyy', // Formato en el tooltip
          displayFormats: {
            day: 'dd MMM' // Formato en el eje
          }
        },
        title: {
          display: true,
          text: 'Fecha',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Valor ($)',
        },
        // Formatear el eje Y como moneda
        ticks: {
           callback: function(value, index, ticks) {
               return '$' + new Intl.NumberFormat('es-CL').format(value);
           }
        }
      },
    },
  };

  return (
    <div className="chart-container">
      <Line options={options} data={chartData} />
    </div>
  );
};

export default PortfolioChart;