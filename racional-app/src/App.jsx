import React, { useState } from 'react';
import './App.css'; 

import { usePortfolioStream } from './hooks/usePortfolioStream';
import Sidebar from './components/Sidebar/Sidebar';
import Header from './components/Header/Header'; // 1. IMPORTAMOS EL NUEVO HEADER
import Dashboard from './views/Dashboard'; 

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { data, loading, error } = usePortfolioStream();

  return (
    <div className="App">
      {/* El Sidebar sigue igual */}
      <Sidebar 
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        data={data}
      />
      
      {/* 2. RENDERIZAMOS EL NUEVO HEADER */}
      {/* Le pasamos la función para que el botón pueda abrir el sidebar */}
      <Header onToggleSidebar={() => setIsSidebarOpen(true)} />
      
      {/* 3. El <header> antiguo de aquí desaparece */}

      {/* El main sigue igual */}
      <main>
        <Dashboard data={data} loading={loading} error={error} />
      </main>
    </div>
  );
}

export default App;