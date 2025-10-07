import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../../src/api/axios';
import {
  Home,
  Inbox,
  Settings,
  FileText,
} from 'lucide-react';
import '../assets/navbar.css';

const Navbar = () => {
  const [activeItem, setActiveItem] = useState('Home');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const navigate = useNavigate();

  const menuItems = [
    { icon: <Home size={22} />, label: 'Inicio', view: 'Home', path: '/Garantias' },
    { icon: <Inbox size={22} />, label: 'Gestión', view: 'Gestion', path: '/Garantias' },
    { icon: <FileText size={22} />, label: 'Historial', view: 'Historial', path: '/Garantias/historial' },
  ];

  const handleItemClick = (item) => {
    setActiveItem(item.view);
    if (item.path) {
      navigate(item.path);
    }
  };

  const toggleSettingsDropdown = (e) => {
    e.stopPropagation();
    setIsSettingsOpen(!isSettingsOpen);
  };

  const logout = async () => {
    try {
      await axios.post('/api/logout', {}, { withCredentials: true });
      navigate('/login');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  return (
    <nav className="app-nav">
      <ul className="app-nav__list">
        {menuItems.map((item, index) => (
          <li
            key={index}
            className={`app-nav__list-item ${activeItem === item.view ? 'app-nav__list-item--active' : ''
              }`}
            onClick={() => handleItemClick(item)}
          >
            <a className="app-nav-link">
              {item.icon}
              <span>{item.label}</span>
            </a>
          </li>
        ))}
        <li
          className="app-nav__list-item"
          onClick={toggleSettingsDropdown}
        >
          <a className="app-nav-link">
            <Settings size={22} />
            <span>Opciones</span>
          </a>
          {isSettingsOpen && (
            <ul className="dropdown-menu">
              <li className="dropdown-item">Perfil</li>
              <li
                className="dropdown-item"
                onClick={() => navigate('/Garantias/historial')}
              >
                Historial
              </li>
              <li className="dropdown-item" onClick={logout}>Salir</li>
            </ul>
          )}
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
