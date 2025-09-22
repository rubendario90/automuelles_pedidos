import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/navbar';
import axios from '../../../src/api/axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../assets/Mostrador.css';

const Mostrador = () => {
  const [facturasPendientes, setFacturasPendientes] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFacturasPendientes = async () => {
      try {
        // Llama a la API para obtener todas las facturas con los detalles necesarios
        const response = await axios.get('/api/facturas-vendedor-revision-final', { withCredentials: true });
        setFacturasPendientes(response.data); // Almacena los datos directamente
      } catch (error) {
        console.error('Error al obtener las facturas pendientes:', error.response?.data || error.message);
        setError('Error al cargar las facturas pendientes.');
      }
    };
    fetchFacturasPendientes();
  }, []);

  const handleGestionarClick = (factura) => {
    navigate('/Mostrador/gestionar-factura', { state: { transaccion: factura.IntTransaccion, documento: factura.IntDocumento } });
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
                <div className="col-12 col-sm-6 col-md-4 mb-4" key={`${factura.IntTransaccion}-${factura.IntDocumento}`}>
                  <div className="card text-center shadow-sm">
                    <div className="card-header bg-custom text-white">Numero De Documento: {factura.IntDocumento}</div>
                    <div className="card-body">
                      <h5 className="card-title text-primary">Transacción: {factura.IntTransaccion}</h5>
                      <p className="card-text">
                        <strong>Vendedor:</strong> {factura.StrUsuarioGra}
                      </p>
                      <p className="card-text">
                        <strong>Cliente:</strong> {factura.ClienteNombre}
                      </p>
                      <p className="card-text">
                        <strong>Fecha:</strong> {new Date(factura.DatFecha1).toLocaleDateString()}
                      </p>
                      <button
                        className="btn btn-custom btn-sm"
                        onClick={() => handleGestionarClick(factura)}
                      >
                        Gestionar
                      </button>
                    </div>
                    <div className="card-footer text-muted">
                      Última actualización: {new Date(factura.DatFecha1).toLocaleDateString()}
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

export default Mostrador;