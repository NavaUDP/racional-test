import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement, // Importamos el elemento de Barra
  Title,
  Tooltip,
  Legend,
  TimeScale,
} from 'chart.js';
import 'chartjs-adapter-date-fns';
import './DailyReturnChart.css'; // Crearemos este archivo

// Registramos los componentes, incluyendo BarElement
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
);

// Colores que usaremos
const COLOR_GREEN = 'rgba(39, 174, 96, 0.7)'; // Verde (ganancia)
const COLOR_RED = 'rgba(231, 76, 60, 0.7)'; // Rojo (pérdida)

const DailyReturnChart = ({ data }) => {
  const chartData = {
    labels: data.map(item => item.date),
    datasets: [
      {
        label: 'Retorno Diario',
        data: data.map(item => item.dailyReturn),
        
        // --- LA MAGIA ESTÁ AQUÍ ---
        // Asignamos el color de fondo dinámicamente
        backgroundColor: (context) => {
          // 'context.raw' es el valor numérico del dato (ej: -0.005)
          const value = context.raw;
          return value >= 0 ? COLOR_GREEN : COLOR_RED;
        },
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false, // Permite que el CSS defina la altura
    plugins: {
      legend: {
        display: false, // No necesitamos leyenda, los colores son obvios
      },
      title: {
        display: true,
        text: 'Volatilidad: Retornos Diarios',
        font: {
          size: 18,
        },
      },
      tooltip: {
        callbacks: {
          // Formatear el tooltip para mostrar porcentaje
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              // Formateamos el valor como porcentaje
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
      }
    },
    scales: {
      x: {
        type: 'time',
        time: {
          unit: 'day',
          displayFormats: {
            day: 'dd MMM'
          }
        },
        grid: {
          display: false, // Ocultar rejilla vertical
        },
      },
      y: {
        title: {
          display: true,
          text: 'Retorno (%)',
        },
        // Formatear el eje Y como porcentaje
        ticks: {
           callback: function(value, index, ticks) {
               // value es ej: 0.005, lo mostramos como '0.5%'
               return (value * 100).toFixed(1) + '%';
           }
        }
      },
    },
  };

  return (
    <div className="chart-container">
      <Bar options={options} data={chartData} />
    </div>
  );
};

export default DailyReturnChart;