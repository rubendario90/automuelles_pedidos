import React, { useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '../src/context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import BodegaRoutes from '../subsites/Bodega/Routes/BodegaRoutes';
import JefeBodega from '../subsites/JefeBodega/Pages/JefeBodega';
import BodegaJefeRoutes from '../subsites/BodegaJefe/Routes/BodegaJefeRoutes';
import JefeCediRoutes from '../subsites/JefeCedi/Routes/JefeCediRoutes';
import DespachosRoutes from '../subsites/Despachos/Routes/DespachosRoutes';
import VendedorRoutes from '../subsites/Vendedores/Routes/VendedorRoutes';
import MensajeriaRoutes from '../subsites/Mensajeria/Routes/MensajeriaRoutes';
import MostradorRoutes from '../subsites/Mostrador/Routes/MostradorRoutes';
import GarantiasRoutes from '../subsites/Garantias/Routes/GarantiasRoutes';
import NotasPage from '../subsites/Notas/Pages/NotasPage';
import Register from './components/Register';

const App = () => {
    useEffect(() => {
        const interval = setInterval(() => {
            console.log('Ejecutando asignar-facturas');
            axios.post('/api/asignar-facturas')
                .then(() => console.log('Job ejecutado correctamente'))
                .catch(() => console.log('Error al ejecutar el job'));
        }, 30000); // 30 segundos
        return () => clearInterval(interval);
    }, []);

    return (
        <Router>
            <AuthProvider>
                <Routes>
                    {/* Ruta raíz que redirige a /login */}
                    <Route path="/" element={<Navigate to="/login" />} />

                    {/* Rutas públicas */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    {/* Rutas protegidas */}
                    <Route
                        path="/dashboard"
                        element={
                            <ProtectedRoute role="users">
                                <Dashboard />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/bodega/*"
                        element={
                            <ProtectedRoute role="Bodega">
                                <BodegaRoutes />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/jefe-bodega"
                        element={
                            <ProtectedRoute role="JefeBodega">
                                <JefeBodega />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/bodega-jefe/*"
                        element={
                            <ProtectedRoute role="BodegaJefe">
                                <BodegaJefeRoutes />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/jefe-cedi/*"
                        element={
                            <ProtectedRoute role="JefeCedi">
                                <JefeCediRoutes />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/Despachos/*"
                        element={
                            <ProtectedRoute role="Despachos">
                                <DespachosRoutes />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/Vendedores/*"
                        element={
                            <ProtectedRoute role="Vendedor">
                                <VendedorRoutes />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/Mensajeria/*"
                        element={
                            <ProtectedRoute role="Mensajeria">
                                <MensajeriaRoutes />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/Mostrador/*"
                        element={
                            <ProtectedRoute role="Mostrador">
                                <MostradorRoutes />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/Garantias/*"
                        element={
                            <ProtectedRoute role="Garantias">
                                <GarantiasRoutes />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/Notas/*"
                        element={
                            <ProtectedRoute role="Notas">
                                <NotasPage />
                            </ProtectedRoute>
                        }
                    />
                </Routes>
            </AuthProvider>
        </Router>
    );
};

export default App;