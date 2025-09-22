import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../../src/api/axios';
import {
  Home,
  Inbox,
  MessageSquare,
  Users,
  Settings,
} from 'lucide-react';
import '../assets/Navbar.css';

const Navbar = () => {
  const [activeItem, setActiveItem] = useState('Home');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [pendingInvoicesCount, setPendingInvoicesCount] = useState(0); // State for pending invoices count
  const navigate = useNavigate();


  const menuItems = [
    { icon: <Home size={22} />, label: 'Inicio', view: 'Home', path: '/Mensajeria' },
    { icon: <Inbox size={22} />, label: 'Descargar Factura ', view: 'descargarfactura', path: '/Mensajeria/descargar-factura' },
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

  const asignarFacturas = async () => {
    try {
      const response = await axios.post('/api/asignar-facturas', {}, { withCredentials: true });
      alert('Facturas asignadas correctamente.');
      console.log('Respuesta backend:', response.data);
    } catch (error) {
      alert('Error al asignar facturas.');
      if (error.response) {
        console.error('Error backend:', error.response.data);
      } else {
        console.error('Error:', error.message);
      }
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
                onClick={() => navigate('/Mensajeria/historial')}
              >
                Historial
              </li>
              <li className="dropdown-item" onClick={asignarFacturas}>Asignar Facturas</li>
              <li className="dropdown-item" onClick={logout}>Salir</li>
            </ul>
          )}
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;