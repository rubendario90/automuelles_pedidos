import React, { useState, useEffect } from 'react';
import axios from '../../../src/api/axios';
import { useAuth } from '../../../src/context/AuthContext';
import Navbar from '../components/Navbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../assets/Facturacion.css';

const Facturacion = () => {
  const { user } = useAuth();
  const [facturasPagadas, setFacturasPagadas] = useState([]);
  const [facturasPendientes, setFacturasPendientes] = useState([]);
  const [estadisticas, setEstadisticas] = useState({});
  const [notificaciones, setNotificaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    fetchData();
    // Refresh data every 30 seconds
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [pagadasRes, pendientesRes, estadisticasRes, notificacionesRes] = await Promise.all([
        axios.get('/api/facturas-pagadas'),
        axios.get('/api/facturas-pendientes-pago'),
        axios.get('/api/estadisticas-pago'),
        axios.get('/api/notificaciones-pago', { params: { limit: 5 } })
      ]);

      setFacturasPagadas(pagadasRes.data);
      setFacturasPendientes(pendientesRes.data);
      setEstadisticas(estadisticasRes.data);
      setNotificaciones(notificacionesRes.data);
      setError(null);
    } catch (error) {
      console.error('Error al cargar datos de facturación:', error);
      setError('Error al cargar datos de facturación');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(amount || 0);
  };

  const renderDashboard = () => (
    <div className="container mt-4">
      <h2 className="fw-bold text-primary mb-4">💰 Dashboard de Facturación</h2>
      
      {/* Statistics Cards */}
      <div className="row mb-4">
        <div className="col-md-3 mb-3">
          <div className="card bg-success text-white">
            <div className="card-body text-center">
              <h5 className="card-title">Facturas Pagadas</h5>
              <h3>{estadisticas.facturas_pagadas || 0}</h3>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card bg-warning text-white">
            <div className="card-body text-center">
              <h5 className="card-title">Pendientes de Pago</h5>
              <h3>{estadisticas.facturas_no_pagadas || 0}</h3>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card bg-info text-white">
            <div className="card-body text-center">
              <h5 className="card-title">En Proceso</h5>
              <h3>{estadisticas.facturas_pendientes || 0}</h3>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card bg-primary text-white">
            <div className="card-body text-center">
              <h5 className="card-title">Total Recaudado</h5>
              <h6>{formatCurrency(estadisticas.monto_total_pagado)}</h6>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Notifications */}
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header bg-primary text-white">
              <h5 className="mb-0">🔔 Notificaciones Recientes de Pago</h5>
            </div>
            <div className="card-body">
              {notificaciones.length > 0 ? (
                <div className="list-group">
                  {notificaciones.map((notificacion) => (
                    <div key={notificacion.id} className="list-group-item">
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <strong>Factura {notificacion.documento}</strong> - 
                          Transacción {notificacion.transaccion}
                          <br />
                          <small className="text-muted">
                            Pagado por: {notificacion.mensajero?.name || 'N/A'} - 
                            {formatCurrency(notificacion.monto_pagado)}
                          </small>
                        </div>
                        <small className="text-muted">
                          {new Date(notificacion.fecha_pago).toLocaleDateString()}
                        </small>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted text-center">No hay notificaciones recientes</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderFacturasPagadas = () => (
    <div className="container mt-4">
      <h2 className="fw-bold text-success mb-4">✅ Facturas Pagadas</h2>
      <div className="table-responsive">
        <table className="table table-hover align-middle table-bordered">
          <thead className="table-success text-center">
            <tr>
              <th>Documento</th>
              <th>Transacción</th>
              <th>Fecha Pago</th>
              <th>Monto Pagado</th>
              <th>Mensajero</th>
              <th>Observaciones</th>
            </tr>
          </thead>
          <tbody>
            {facturasPagadas.length > 0 ? (
              facturasPagadas.map((factura) => (
                <tr key={factura.id}>
                  <td className="text-center">{factura.documento}</td>
                  <td className="text-center">{factura.transaccion}</td>
                  <td className="text-center">
                    {new Date(factura.fecha_pago).toLocaleDateString()}
                  </td>
                  <td className="text-center">
                    {formatCurrency(factura.monto_pagado)}
                  </td>
                  <td className="text-center">{factura.mensajero?.name || 'N/A'}</td>
                  <td className="text-center">
                    {factura.observaciones || 'Sin observaciones'}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center text-muted">
                  No hay facturas pagadas registradas
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderFacturasPendientes = () => (
    <div className="container mt-4">
      <h2 className="fw-bold text-warning mb-4">⏳ Facturas Pendientes de Pago</h2>
      <div className="table-responsive">
        <table className="table table-hover align-middle table-bordered">
          <thead className="table-warning text-center">
            <tr>
              <th>Documento</th>
              <th>Transacción</th>
              <th>Estado</th>
              <th>Fecha Entrega</th>
              <th>Mensajero</th>
              <th>Observaciones</th>
            </tr>
          </thead>
          <tbody>
            {facturasPendientes.length > 0 ? (
              facturasPendientes.map((factura) => (
                <tr key={factura.id}>
                  <td className="text-center">{factura.documento}</td>
                  <td className="text-center">{factura.transaccion}</td>
                  <td className="text-center">
                    <span className={`badge ${factura.estado_pago === 'no_pagado' ? 'bg-danger' : 'bg-warning'}`}>
                      {factura.estado_pago === 'no_pagado' ? 'No Pagado' : 'Pendiente'}
                    </span>
                  </td>
                  <td className="text-center">
                    {new Date(factura.created_at).toLocaleDateString()}
                  </td>
                  <td className="text-center">{factura.mensajero?.name || 'N/A'}</td>
                  <td className="text-center">
                    {factura.observaciones || 'Sin observaciones'}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center text-muted">
                  No hay facturas pendientes de pago
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderContent = () => {
    if (loading) {
      return (
        <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="alert alert-danger text-center">
          {error}
          <br />
          <button className="btn btn-primary mt-2" onClick={fetchData}>
            Reintentar
          </button>
        </div>
      );
    }

    switch (activeTab) {
      case 'dashboard':
        return renderDashboard();
      case 'pagadas':
        return renderFacturasPagadas();
      case 'pendientes':
        return renderFacturasPendientes();
      default:
        return renderDashboard();
    }
  };

  return (
    <div className="facturacion-container">
      <Navbar />
      <div className="main-content">
        {/* Navigation Tabs */}
        <nav className="nav nav-pills nav-justified bg-light p-3 mb-4">
          <button
            className={`nav-link ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            📊 Dashboard
          </button>
          <button
            className={`nav-link ${activeTab === 'pagadas' ? 'active' : ''}`}
            onClick={() => setActiveTab('pagadas')}
          >
            ✅ Facturas Pagadas
          </button>
          <button
            className={`nav-link ${activeTab === 'pendientes' ? 'active' : ''}`}
            onClick={() => setActiveTab('pendientes')}
          >
            ⏳ Pendientes de Pago
          </button>
        </nav>

        {renderContent()}
      </div>
    </div>
  );
};

export default Facturacion;