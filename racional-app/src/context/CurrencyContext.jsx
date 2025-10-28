import React, { createContext, useState, useContext, useMemo } from 'react';

// El tipo de cambio simulado.
// En una app real, esto vendría de una API.
const SIMULATED_USD_RATE = 950; 

// 1. Crear el Contexto
const CurrencyContext = createContext();

// 2. Crear el Proveedor (Provider)
// Este componente envolverá tu aplicación
export const CurrencyProvider = ({ children }) => {
  const [currency, setCurrency] = useState('CLP'); // Moneda por defecto

  // Usamos useMemo para no recalcular el valor en cada render
  const value = useMemo(() => ({
    currency,
    setCurrency,
    exchangeRate: SIMULATED_USD_RATE,
  }), [currency]); // Solo se actualiza si 'currency' cambia

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
};

// 3. Crear un Hook personalizado
// Esto facilita que cualquier componente acceda al estado
export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency debe ser usado dentro de un CurrencyProvider');
  }
  return context;
};