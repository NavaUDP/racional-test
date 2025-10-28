import React from 'react';
import Dashboard from './views/Dashboard';
import './App.css'; 
// 1. IMPORTA el logo desde la carpeta de assets
import racionalLogo from './assets/racional-logo.png'; // <-- CAMBIA 'logo.svg' SI TU ARCHIVO SE LLAMA DIFERENTE

function App() {
  return (
    <div className="App">
      {/* 2. ESTRUCTURA DEL HEADER */}
      <header className="App-header">
        <img src={racionalLogo} className="header-logo" alt="Racional Logo" />
        <h1>Bienvenido a tu Portafolio</h1>
      </header>
      
      {/* El 'main' ahora contendrá el dashboard centrado */}
      <main>
        <Dashboard />
      </main>
    </div>
  );
}

export default App;