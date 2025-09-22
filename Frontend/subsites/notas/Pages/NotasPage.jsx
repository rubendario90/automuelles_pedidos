import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar'; 
import Home from './Home';
import Historial from './Historial';

const NotasPage = () => {
  const [activeView, setActiveView] = useState(() => {
    return localStorage.getItem('activeView') || 'Home';
  });

  const [sidebarExpanded, setSidebarExpanded] = useState(false);

  useEffect(() => {
    localStorage.setItem('activeView', activeView);
  }, [activeView]);

  const renderContent = () => {
    switch (activeView) {
      case 'Home':
        return <Home />;
      case 'Historial':
        return <Historial />;
      default:
        return <Home />;
    }
  };

  return (
    <div className="main-container">
      <Sidebar setExpanded={setSidebarExpanded} setActiveView={setActiveView} />
      <div
        className="content"
        style={{
          marginLeft: sidebarExpanded ? '220px' : '60px',
          transition: 'margin-left 0.3s',
          padding: '20px',
        }}
      >
        {renderContent()}
      </div>
    </div>
  );
};

export default NotasPage;