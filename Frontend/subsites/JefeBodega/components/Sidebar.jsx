import React, { useState } from 'react';
import {
  Home,
  File,
  Lock,
  Bell,
  Menu,
  LogOut,
  UserCheck,
  Repeat,
  FilePlus // Icono para el botón de cambio de rol
} from 'lucide-react';
import '../assets/Sidebar.css';
import axios from '../../../src/api/axios'; // Importa Axios para realizar solicitudes
import { useNavigate } from 'react-router-dom'; // Para redirigir al login

const Sidebar = ({ setExpanded, setActiveView }) => {
  const [isExpanded, setIsExpandedLocal] = useState(false);
  const navigate = useNavigate(); // Hook para redirigir al login

  const toggleSidebar = () => {
    const newValue = !isExpanded;
    setIsExpandedLocal(newValue);
    setExpanded(newValue); // Notifica al padre
  };

  const logout = async () => {
    try {
      await axios.post('/api/logout', {}, { withCredentials: true });
      navigate('/login'); // Redirige al login
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };
  const changeRole = async () => {
    try {
      // Realiza la solicitud para cambiar el rol en la base de datos
      const response = await axios.put('/api/change-role', { newRole: 'BodegaJefe' }, { withCredentials: true });
  
      if (response.status === 200) {
        // Actualiza el rol del usuario en el frontend (si usas un contexto de autenticación)
        const updatedUser = { ...response.data }; // Suponiendo que el backend devuelve el usuario actualizado
        console.log('Rol cambiado exitosamente:', updatedUser);
  
        // Redirige a la vista correspondiente
        navigate('/bodega-jefe');
      } else {
        alert('No se pudo cambiar el rol.');
      }
    } catch (error) {
      console.error('Error al cambiar el rol:', error);
      alert('Ocurrió un error al intentar cambiar el rol.');
    }
  };

  const menuItems = [
    { icon: <Home size={22} />, label: 'Inicio', view: 'Home' },
    { icon: <File size={22} />, label: 'Historial', view: 'FacturasCreadas' },
    { icon: <Lock size={22} />, label: 'Revisión Final', view: 'RevisionFinal' },
    { icon: <Bell size={22} />, label: 'Facturas Asignadas', view: 'Notificaciones' },
    { icon: <Repeat size={22} />, label: 'Reasignar Facturas', view: 'ReasignarFactura' },
    { icon: <FilePlus size={22} />, label: 'Crear Notas', view: 'Notas' },
  ];

  return (
    <div className={`sidebar ${isExpanded ? 'expanded' : ''}`}>
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
        {/* Botón de Logout */}
        <li
          className={`sidebar-menu-item ${isExpanded ? 'expanded' : ''}`}
          onClick={logout} // Llama a la función de logout
        >
          <LogOut size={22}/>
          {isExpanded && <span>Logout</span>}
        </li>
        {/* Botón de Cambio de Rol */}
        <li
          className={`sidebar-menu-item ${isExpanded ? 'expanded' : ''}`}
          onClick={changeRole}
        >
          <UserCheck size={22} />
          {isExpanded && <span>Cambio de Rol</span>}
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;