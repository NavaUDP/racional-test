import React from 'react';
import './Header.css';
import racionalLogo from '../../assets/racional-logo.png'; // Asegúrate que la ruta sea correcta

const Header = ({ onToggleSidebar }) => {
  return (
    <header className="site-header">
      <div className="header-content">
        <button
          className="sidebar-toggle-btn"
          onClick={onToggleSidebar}
          aria-label="Abrir historial de aportes" // Mejorar accesibilidad
        >
          {/* ESTRUCTURA MODIFICADA DEL BOTÓN */}
          <span className="sidebar-toggle-icon">☰</span>
          <span className="sidebar-toggle-text">Aportes</span> {/* <-- TEXTO AÑADIDO */}
        </button>

        <img src={racionalLogo} className="header-logo" alt="Racional Logo" />
        <h1 className="header-title">Bienvenido a tu Portafolio</h1>
      </div>
    </header>
  );
};

export default Header;