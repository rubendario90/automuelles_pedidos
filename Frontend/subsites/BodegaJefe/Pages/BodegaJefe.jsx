
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import Navbar from '../components/navbar';
import axios from '../../../src/api/axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../assets/BodegaJefe.css';

const BodegaJefe = () => {
  const [facturasPendientes, setFacturasPendientes] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Initialize useNavigate


  useEffect(() => {
    const fetchFacturasPendientes = async () => {
      try {
        const response = await axios.get('/api/facturas-pendientes', { withCredentials: true });
        setFacturasPendientes(response.data);
      } catch (error) {
        console.error('Error al obtener las facturas pendientes:', error.response?.data || error.message);
        setError('Error al cargar las facturas pendientes.');
      }
    };

    fetchFacturasPendientes();
    const interval = setInterval(fetchFacturasPendientes, 30000); // 30 segundos
    return () => clearInterval(interval);
  }, []);

  const handleGestionarClick = (factura) => {
    navigate('/bodega-jefe/gestionar-factura', { state: { factura } }); // Navigate with state
  };

  return (
    <div className="bodega-jefe-container">
      <Navbar />
      <div className="main-content">
        <div className="container mt-4">
          <h2 className="fw-bold text-center mb-4 text-custom-color">📋 Facturas Pendientes</h2>
          {error && <p className="text-danger text-center">{error}</p>}
          <div className="row">
            {facturasPendientes.length > 0 ? (
              facturasPendientes.map((factura) => (
                <div className="col-12 col-sm-6 col-md-4 mb-4" key={factura.id}>
                  <div className="card text-center shadow-sm">
                    <div className="card-header bg-custom text-white">
                      Factura ID: {factura.factura_id}
                    </div>
                    <div className="card-body">
                      <div className="icon-circle mb-2">
                        <i className="bi bi-file-earmark-text"></i>
                      </div>
                      <h5 className="card-title text-primary">
                        <i className="bi bi-arrow-left-right me-1"></i>
                        Transacción: {factura.transaccion}
                      </h5>
                      <p className="card-text">
                        <i className="bi bi-file-earmark me-1"></i>
                        <strong>Documento:</strong> {factura.documento}
                      </p>
                      <p className="card-text">
                        <i className="bi bi-info-circle me-1"></i>
                        <strong>Estado:</strong> {factura.estado}
                      </p>
                      <p className="card-text">
                        <i className="bi bi-calendar-event me-1"></i>
                        <strong>Fecha:</strong> {new Date(factura.created_at).toLocaleDateString()}
                      </p>
                      <button
                        className="btn btn-custom btn-sm mt-2"
                        onClick={() => handleGestionarClick(factura)}
                      >
                        <i className="bi bi-gear me-1"></i>
                        Gestionar
                      </button>
                    </div>
                    <div className="card-footer text-muted">
                      <i className="bi bi-clock-history me-1"></i>
                      Última actualización: {new Date(factura.updated_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-12 text-center">
                <p className="text-muted">No tienes facturas pendientes.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BodegaJefe;