import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Importar correctamente useAuth

const ProtectedRoute = ({ children, role }) => {
    const { user } = useAuth();

    if (!user) {
        return <Navigate to="/login" />; // Redirigir al login si no está autenticado
    }

    if (user.role !== role) {
        return <Navigate to="/" />; // Redirigir si el rol no coincide
    }

    return children;
};

export default ProtectedRoute;