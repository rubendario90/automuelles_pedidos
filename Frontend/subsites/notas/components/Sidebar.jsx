import React, { useState, useEffect, useRef } from 'react';
import {
  Home,
  Bell,
  Menu,
  LogOut
} from 'lucide-react';
import '../assets/Sidebar.css';
import axios from '../../../src/api/axios';
import { useNavigate } from 'react-router-dom';

const Sidebar = ({ setExpanded, setActiveView }) => {
  const [isExpanded, setIsExpandedLocal] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);
  const audioRef = useRef(null);
  const navigate = useNavigate();

  const toggleSidebar = () => {
    const newValue = !isExpanded;
    setIsExpandedLocal(newValue);
    setExpanded(newValue);
  };

  const logout = async () => {
    try {
      await axios.post('/api/logout', {}, { withCredentials: true });
      navigate('/login');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  useEffect(() => {
    const fetchPendingCount = async () => {
      const res = await axios.get('/api/contar-pendientes');
      setPendingCount(res.data.pendientes);
      if (res.data.pendientes > 0 && audioRef.current) {
        audioRef.current.play();
      }
    };
    fetchPendingCount();
    const interval = setInterval(fetchPendingCount, 30000); // 30 segundos
    return () => clearInterval(interval);
  }, []);

  const menuItems = [
    { icon: <Home size={22} />, label: 'Inicio', view: 'Home' },
    { icon: <Bell size={22} />, label: 'Historial', view: 'Historial' },
    {
      icon: (
        <span style={{ position: 'relative' }}>
          <Bell size={22} />
          {pendingCount > 0 && (
            <span className="badge bg-danger" style={{
              position: 'absolute',
              top: -8,
              right: -8,
              fontSize: 12,
              borderRadius: '50%',
              padding: '2px 6px'
            }}>
              {pendingCount}
            </span>
          )}
        </span>
      ),
      label: 'Pendientes',
      view: 'Pendientes'
    }
  ];

  return (
    <div className={`sidebar ${isExpanded ? 'expanded' : ''}`}>
      <audio ref={audioRef} src="/sound/notification.mp3" preload="auto" />
      <button
        onClick={toggleSidebar}
        className={`sidebar-button ${isExpanded ? 'expanded' : ''}`}
      >
        <Menu size={24} />
      </button>
      <ul className="sidebar-menu">
        {menuItems.map((item, index) => (
          <li
            key={index}
            className={`sidebar-menu-item ${isExpanded ? 'expanded' : ''}`}
            onClick={() => setActiveView(item.view)}
          >
            {item.icon}
            {isExpanded && <span>{item.label}</span>}
          </li>
        ))}
        <li
          className={`sidebar-menu-item ${isExpanded ? 'expanded' : ''}`}
          onClick={logout}
        >
          <LogOut size={22} />
          {isExpanded && <span>Logout</span>}
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;