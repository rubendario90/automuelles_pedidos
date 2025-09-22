import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import FacturasCreadas from './FacturasCreadas';
import RevisionFinal from './RevisionFinal';
import Home from './Home';
import Notificaciones from './Notificaciones';
import ReasignarFactura from './ReasignarFactura';
import Notas from './Notas';

const JefeBodega = () => {
  // Recuperar la vista activa desde localStorage o usar 'Home' como predeterminado
  const [activeView, setActiveView] = useState(() => {
    return localStorage.getItem('activeView') || 'Home';
  });

  const [sidebarExpanded, setSidebarExpanded] = useState(false); // Estado para el tamaño del sidebar

  // Guardar la vista activa en localStorage cada vez que cambie
  useEffect(() => {
    localStorage.setItem('activeView', activeView);
  }, [activeView]);

  const renderContent = () => {
    switch (activeView) {
      case 'Home':
        return <Home />;
      case 'FacturasCreadas':
        return <FacturasCreadas />;
      case 'RevisionFinal':
        return <RevisionFinal />;
      case 'FacturasAsignadas':
        return <FacturasAsignadas />;
      case 'Notificaciones':
        return <Notificaciones />;
      case 'ReasignarFactura':
        return <ReasignarFactura />;
      case 'Notas':
        return <Notas />;
      default:
        return <Home />;
    }
  };

  return (
    <div className="main-container">
      {/* Sidebar */}
      <Sidebar setExpanded={setSidebarExpanded} setActiveView={setActiveView} />

      {/* Contenido dinámico */}
      <div
        className="content"
        style={{
          marginLeft: sidebarExpanded ? '220px' : '60px', // Ajusta el margen según el estado del sidebar
          transition: 'margin-left 0.3s',
          padding: '20px',
        }}
      >
        {renderContent()} {/* Renderiza el contenido dinámico basado en la vista activa */}
      </div>
    </div>
  );
};

export default JefeBodega;