import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../../src/api/axios';
import { Home, MapPin, FileText, Settings } from 'lucide-react';
import '../assets/Navbar.css';

const Navbar = () => {
  const [activeItem, setActiveItem] = useState('Home');
  const [isOpen, setIsOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const navigate = useNavigate();

  const menuItems = [
    { icon: <Home size={22} />, label: 'Inicio', view: 'Home', path: '/Mostrador' },
    { icon: <MapPin size={22} />, label: 'Modificar Domicilio', view: 'ModificarDomicilio', path: '/Mostrador/marcar-domicilio' },
    { icon: <FileText size={22} />, label: 'Descargar Factura', view: 'DescargarFactura', path: '/Mostrador/descargar-factura' },
  ];

  const handleItemClick = (item) => {
    setActiveItem(item.view);
    if (item.path) navigate(item.path);
  };

  const toggleSidebar = () => setIsOpen(!isOpen);

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

  const changeRole = async () => {
    try {
      const response = await axios.put('/api/change-role', { newRole: 'Despachos' }, { withCredentials: true });
      if (response.status === 200) navigate('/Despachos');
    } catch (error) {
      alert('Error al cambiar de rol.');
    }
  };

  return (
    <div className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-toggle" onClick={toggleSidebar}>
        ☰
      </div>
      <ul className="sidebar-menu">
        {menuItems.map((item, index) => (
          <li
            key={index}
            className={`sidebar-item ${activeItem === item.view ? 'active' : ''}`}
            onClick={() => handleItemClick(item)}
          >
            {item.icon}
            {isOpen && <span className="label">{item.label}</span>}
          </li>
        ))}

        <li className="sidebar-item" onClick={toggleSettingsDropdown}>
          <Settings size={22} />
          {isOpen && <span className="label">Opciones</span>}
        </li>

        {isSettingsOpen && (
          <ul className="sidebar-menu">
            {isOpen && (
              <>
                <li className="sidebar-item" onClick={() => navigate('/Mostrador/historial')}>Historial</li>
                <li className="sidebar-item" onClick={changeRole}>Cambio de Rol</li>
                <li className="sidebar-item" onClick={logout}>Salir</li>
              </>
            )}
          </ul>
        )}
      </ul>
    </div>
  );
};

export default Navbar;