import React, { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Crear el contexto de autenticación
const AuthContext = createContext();

// Proveedor del contexto de autenticación
const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem('user');
        return storedUser ? JSON.parse(storedUser) : null;
    }); // Estado del usuario autenticado
    const navigate = useNavigate();

    const login = (userData) => {
        setUser(userData); // Guardar los datos del usuario
        localStorage.setItem('user', JSON.stringify(userData));
        if (userData.role === 'users') {
            navigate('/dashboard'); // Redirigir al Dashboard
        } else if (userData.role === 'Bodega') {
            navigate('/bodega'); // Redirigir al subsite Bodega
        }
        else if (userData.role === 'JefeBodega') {
            navigate('/jefe-bodega'); // Redirigir al subsite Bodega
        }
    };

    const logout = () => {
        setUser(null); // Limpiar el usuario
        localStorage.removeItem('user');
        navigate('/login'); // Redirigir al login
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// Hook personalizado para usar el contexto de autenticación
export const useAuth = () => useContext(AuthContext);

export { AuthProvider };
