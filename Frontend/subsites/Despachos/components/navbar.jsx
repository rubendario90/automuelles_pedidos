import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from '../../../src/api/axios';
import {
  Home,
  Inbox,
  Settings,
  Users,
  ClipboardList,
  MapPin,
} from 'lucide-react';
import '../assets/Navbar.css';

const Navbar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation(); // Hook to get the current route

  const menuItems = [
    { icon: <Home size={20} />, label: 'Inicio', view: 'Home', path: '/Despachos' },
    { icon: <Users size={20} />, label: 'Reasignar pedidos', view: 'ReasignarPedidos', path: '/Despachos/Reasignar-pedidos' },
    { icon: <ClipboardList size={20} />, label: 'Pedidos Asignados', view: 'PedidosAsignadosDespachos', path: '/Despachos/gestionar-factura-despachos' },
    { icon: <ClipboardList size={20} />, label: 'Pedidos Despachos', view: 'PedidosDespachos', path: '/Despachos/pedidos-despachos' },
    { icon: <ClipboardList size={20} />, label: 'Pedidos En Curso', view: 'PedidosCurso', path: '/Despachos/rastreo-pedidos' },
    { icon: <MapPin size={20} />, label: 'Modificar Domicilio', view: 'ModificarDomicilio', path: '/Despachos/marcar-domicilio' },
  ];

  // Automatically set the active item based on the current route
  useEffect(() => {
    const currentItem = menuItems.find((item) => item.path === location.pathname);
    if (currentItem) {
      setActiveItem(currentItem.view);
    }
  }, [location.pathname]); // Run this effect whenever the route changes

  const [activeItem, setActiveItem] = useState('Home');

  const handleItemClick = (item) => {
    setActiveItem(item.view); // Update the active item
    if (item.path) navigate(item.path);
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
      await axios.post('/api/asignar-facturas', {}, { withCredentials: true });
      alert('Facturas asignadas correctamente.');
    } catch (error) {
      alert('Error al asignar facturas.');
    }
  };

  const changeRole = async () => {
    try {
      const response = await axios.put('/api/change-role', { newRole: 'Mostrador' }, { withCredentials: true });
      if (response.status === 200) navigate('/Mostrador');
    } catch (error) {
      alert('Ocurrió un error al intentar cambiar el rol.');
    }
  };

  return (
    <nav className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
      <div className="sidebar-toggle" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
        <Settings size={22} />
      </div>
      <ul className="sidebar-menu">
        {menuItems.map((item, idx) => (
          <li
            key={idx}
            className={`sidebar-item ${activeItem === item.view ? 'active' : ''}`}
            onClick={() => handleItemClick(item)}
          >
            {item.icon}
            {isSidebarOpen && <span className="label">{item.label}</span>}
          </li>
        ))}
        {isSidebarOpen && (
          <>
            <li className="sidebar-divider" />
            <li className="sidebar-item" onClick={() => navigate('/Despachos/historial')}>
              📄 <span className="label">Historial</span>
            </li>
            <li className="sidebar-item" onClick={changeRole}>
              🔄 <span className="label">Cambio Rol</span>
            </li>
            <li className="sidebar-item" onClick={logout}>
              🚪 <span className="label">Salir</span>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;