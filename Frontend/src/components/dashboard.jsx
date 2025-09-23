import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const Dashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const getAvailableModules = () => {
        const modules = [];
        
        if (user?.role === 'Bodega') {
            modules.push({
                name: 'Bodega',
                path: '/bodega',
                icon: '📦',
                description: 'Gestión de inventario y productos'
            });
        }
        
        if (user?.role === 'JefeBodega') {
            modules.push({
                name: 'Jefe de Bodega',
                path: '/jefe-bodega',
                icon: '👷‍♂️',
                description: 'Supervisión de bodega'
            });
        }
        
        if (user?.role === 'BodegaJefe') {
            modules.push({
                name: 'Bodega Jefe',
                path: '/bodega-jefe',
                icon: '🏭',
                description: 'Administración de bodega'
            });
        }
        
        if (user?.role === 'JefeCedi') {
            modules.push({
                name: 'Jefe CEDI',
                path: '/jefe-cedi',
                icon: '🏢',
                description: 'Centro de distribución'
            });
        }
        
        if (user?.role === 'Despachos') {
            modules.push({
                name: 'Despachos',
                path: '/Despachos',
                icon: '🚚',
                description: 'Gestión de despachos'
            });
        }
        
        if (user?.role === 'Vendedor') {
            modules.push({
                name: 'Vendedores',
                path: '/Vendedores',
                icon: '💼',
                description: 'Sistema de ventas'
            });
        }
        
        if (user?.role === 'Mensajeria') {
            modules.push({
                name: 'Mensajería',
                path: '/Mensajeria',
                icon: '📮',
                description: 'Entrega de facturas'
            });
        }
        
        if (user?.role === 'Mostrador') {
            modules.push({
                name: 'Mostrador',
                path: '/Mostrador',
                icon: '🛒',
                description: 'Atención en mostrador'
            });
        }
        
        if (user?.role === 'Notas') {
            modules.push({
                name: 'Notas',
                path: '/Notas',
                icon: '📝',
                description: 'Gestión de notas'
            });
        }
        
        if (user?.role === 'Facturacion') {
            modules.push({
                name: 'Facturación',
                path: '/Facturacion',
                icon: '💰',
                description: 'Control de pagos y facturación'
            });
        }
        
        return modules;
    };

    const availableModules = getAvailableModules();

    return (
        <div className="dashboard-container" style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
            <div className="container py-5">
                <div className="row mb-4">
                    <div className="col-12">
                        <h1 className="display-4 fw-bold text-primary text-center mb-2">
                            🏢 Sistema Automuelles
                        </h1>
                        <p className="lead text-center text-muted">
                            Bienvenido, <strong>{user?.name}</strong> | Rol: <span className="badge bg-primary">{user?.role}</span>
                        </p>
                    </div>
                </div>

                {availableModules.length > 0 ? (
                    <>
                        <div className="row mb-4">
                            <div className="col-12">
                                <h3 className="fw-bold text-secondary mb-3">📋 Módulos Disponibles</h3>
                            </div>
                        </div>
                        
                        <div className="row g-4">
                            {availableModules.map((module, index) => (
                                <div key={index} className="col-12 col-md-6 col-lg-4">
                                    <div 
                                        className="card h-100 shadow-sm border-0 module-card"
                                        style={{ 
                                            cursor: 'pointer',
                                            transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out'
                                        }}
                                        onClick={() => navigate(module.path)}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.transform = 'translateY(-5px)';
                                            e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.1)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.transform = 'translateY(0)';
                                            e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
                                        }}
                                    >
                                        <div className="card-body text-center p-4">
                                            <div className="mb-3" style={{ fontSize: '3rem' }}>
                                                {module.icon}
                                            </div>
                                            <h5 className="card-title fw-bold text-primary mb-2">
                                                {module.name}
                                            </h5>
                                            <p className="card-text text-muted">
                                                {module.description}
                                            </p>
                                            <button className="btn btn-primary btn-sm mt-2">
                                                Acceder →
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                ) : (
                    <div className="row">
                        <div className="col-12">
                            <div className="alert alert-warning text-center" role="alert">
                                <h4 className="alert-heading">⚠️ Sin acceso</h4>
                                <p>No tienes permisos para acceder a ningún módulo del sistema.</p>
                                <hr />
                                <p className="mb-0">Contacta al administrador para obtener los permisos necesarios.</p>
                            </div>
                        </div>
                    </div>
                )}

                <div className="row mt-5">
                    <div className="col-12 text-center">
                        <button 
                            className="btn btn-outline-secondary"
                            onClick={() => {
                                localStorage.removeItem('token');
                                navigate('/login');
                            }}
                        >
                            🚪 Cerrar Sesión
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;