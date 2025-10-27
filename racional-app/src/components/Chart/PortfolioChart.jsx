import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

/**
 * Este componente espera que la prop 'data' sea un ARRAY de objetos.
 * Ejemplo:
 * [
 * { name: '2023-10-01', value: 1000 },
 * { name: '2023-10-02', value: 1020 },
 * { name: '2023-10-03', value: 1015 }
 * ]
 */
export const PortfolioChart = ({ data }) => {
  if (!data || data.length === 0) {
    return <p>No hay datos históricos para mostrar.</p>;
  }

  return (
    // ResponsiveContainer hace que el gráfico ocupe el 100% del div padre
    <ResponsiveContainer width="100%" height={400}>
      <LineChart
        data={data}
        margin={{
          top: 20, right: 30, left: 20, bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        {/* 'dataKey' debe coincidir con la clave del objeto de datos (ej: 'name') */}
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line 
          type="monotone" 
          // 'dataKey' debe coincidir con la clave del valor (ej: 'value')
          dataKey="value" 
          stroke="#8884d8" 
          strokeWidth={2}
          activeDot={{ r: 8 }} 
        />
      </LineChart>
    </ResponsiveContainer>
  );
};