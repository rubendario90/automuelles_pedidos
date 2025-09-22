
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import Navbar from '../components/navbar';
import axios from '../../../src/api/axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../assets/Bodega.css';

const Bodega = () => {
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
    const interval = setInterval(fetchFacturasPendientes, 30000); 
    return () => clearInterval(interval);
  }, []);

  const handleGestionarClick = (factura) => {
    navigate('/Bodega/gestionar-factura', { state: { factura } }); // Navigate with state
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
                    <div className="card-header bg-custom text-white">Factura ID: {factura.factura_id}</div>
                    <div className="card-body">
                      <h5 className="card-title text-primary">Transacción: {factura.transaccion}</h5>
                      <p className="card-text">
                        <strong>Documento:</strong> {factura.documento}
                      </p>
                      <p className="card-text">
                        <strong>Estado:</strong> {factura.estado}
                      </p>
                      <p className="card-text">
                        <strong>Fecha:</strong> {new Date(factura.created_at).toLocaleDateString()}
                      </p>
                      <button
                        className="btn btn-custom btn-sm"
                        onClick={() => handleGestionarClick(factura)} 
                      >
                        Gestionar
                      </button>
                    </div>
                    <div className="card-footer text-muted">
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

export default Bodega;