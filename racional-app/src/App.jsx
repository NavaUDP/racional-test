import React from 'react';
import Dashboard from './views/Dashboard'; // Importamos tu nueva vista
import './App.css'; // Estilos globales

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Dashboard de Portafolio</h1>
      </header>
      <main>
        <Dashboard />
      </main>
    </div>
  );
}

export default App;