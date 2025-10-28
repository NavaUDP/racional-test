import React, { useMemo } from 'react';
import './Sidebar.css';
import { format } from 'date-fns'; // Para formatear fechas

/**
 * Helper para formatear números a moneda
 */
const formatCurrency = (value) => {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    maximumFractionDigits: 0, 
  }).format(value);
};

const Sidebar = ({ isOpen, onClose, data }) => {

  // Usamos useMemo para procesar el historial de contribuciones
  // solo cuando los datos (de Firebase) cambien.
  const contributionHistory = useMemo(() => {
    if (!data || data.length === 0) return [];
    
    const history = [];
    let lastContribution = -1; // Usamos -1 para capturar el primer evento

    // Iteramos para encontrar solo los puntos donde el total de contribuciones cambió
    data.forEach(item => {
      if (item.contributions !== lastContribution) {
        // Calculamos la diferencia (el monto del depósito/retiro)
        const change = lastContribution !== -1 ? item.contributions - lastContribution : item.contributions;
        
        history.push({
          date: item.date,
          total: item.contributions,
          change: change,
        });
        lastContribution = item.contributions;
      }
    });
    
    // Devolvemos el historial en orden cronológico inverso (lo más nuevo primero)
    return history.reverse();

  }, [data]); // Esta función solo se re-ejecuta si 'data' cambia

  // Clases CSS dinámicas para abrir/cerrar
  const sidebarClasses = isOpen ? 'sidebar open' : 'sidebar';
  const overlayClasses = isOpen ? 'sidebar-overlay open' : 'sidebar-overlay';

  return (
    <>
      {/* El fondo oscuro que cierra el menú al hacer clic */}
      <div className={overlayClasses} onClick={onClose}></div>
      
      {/* El panel lateral */}
      <div className={sidebarClasses}>
        <div className="sidebar-header">
          <h2>Historial de Aportes</h2>
          <button onClick={onClose} className="sidebar-close-btn">&times;</button>
        </div>
        
        <div className="sidebar-content">
          {contributionHistory.length > 0 ? (
            <ul className="history-list">
              {contributionHistory.map((item, index) => (
                <li key={index} className="history-item">
                  <div className="history-item-date">
                    {format(item.date, 'dd MMM yyyy')}
                  </div>
                  <div className="history-item-details">
                    <span className={`history-item-change ${item.change >= 0 ? 'positive' : 'negative'}`}>
                      {item.change >= 0 ? '+' : ''}{formatCurrency(item.change)}
                    </span>
                    <span className="history-item-total">
                      Total aportado: {formatCurrency(item.total)}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p>No se encontraron movimientos de contribución.</p>
          )}
        </div>
      </div>
    </>
  );
};

export default Sidebar;