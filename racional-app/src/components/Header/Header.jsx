import React from 'react';
import './Header.css'; // Importamos los estilos que crearemos
import racionalLogo from '../../assets/racional-logo.png'; // Ajustamos la ruta para subir 2 niveles

/**
 * El nuevo componente Header.
 * Recibe 'onToggleSidebar' como prop para poder llamar a la función
 * que está en App.jsx.
 */
const Header = ({ onToggleSidebar }) => {
  return (
    <header className="site-header">
      {/* Usamos un div interno para centrar el contenido 
        y que coincida con el ancho del dashboard
      */}
      <div className="header-content">
        <button 
          className="sidebar-toggle-btn" 
          onClick={onToggleSidebar} // Usamos la prop
          aria-label="Abrir menú"
        >
          ☰
        </button>
        <img src={racionalLogo} className="header-logo" alt="Racional Logo" />
        <h1 className="header-title">Bienvenido a tu Portafolio</h1>
      </div>
    </header>
  );
};

export default Header;