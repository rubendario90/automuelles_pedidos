import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/navbar';
import axios from '../../../src/api/axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../assets/Mensajeria.css';

const Mensajeria = () => {
  const [facturasPendientes, setFacturasPendientes] = useState([]);
  const [documentDetails, setDocumentDetails] = useState({});
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async () => {
    const response = await axios.post('/api/login', { email, password });
    const usuario = response.data; // {id, name, email, role}
    localStorage.setItem('user_id', usuario.id);
    localStorage.setItem('user_name', usuario.name);
    localStorage.setItem('user_role', usuario.role);
    // Redirige o actualiza el estado de la app
  };

  useEffect(() => {
    const fetchFacturasPendientes = async () => {
      const userId = localStorage.getItem('user_id');
      if (!userId) {
        setError('No se encontró el user_id. Inicia sesión nuevamente.');
        return;
      }
      try {
        const response = await axios.post('/api/facturas-despachos-asignadas', {
          user_id: userId
        }, { withCredentials: true });
        setFacturasPendientes(response.data);
      } catch (error) {
        setError('Error al cargar las facturas pendientes.');
      }
    };
    fetchFacturasPendientes();
  }, []);

  useEffect(() => {
    const fetchDetails = async () => {
      const details = {};
      for (const factura of facturasPendientes) {
        try {
          const res = await axios.post('/api/document-details', {
            transaccion: factura.transaccion,
            documento: factura.documento,
          });
          details[factura.id] = {
            usuario: res.data[0]?.StrUsuarioGra || '',
            ClienteNombre: res.data[0]?.ClienteNombre || '',
          };
        } catch {
          details[factura.id] = {
            usuario: '',
            ClienteNombre: '',
          };
        }
      }
      setDocumentDetails(details);
    };
    if (facturasPendientes.length > 0) fetchDetails();
  }, [facturasPendientes]);

  const handleGestionarClick = (factura) => {
    navigate('/Mensajeria/gestionar-factura', { state: { factura } });
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
                      <p className="card-text">
                        <strong>Vendedor:</strong> {documentDetails[factura.id]?.usuario || 'Cargando...'}
                      </p>
                      <p className="card-text">
                        <strong>Cliente:</strong> {documentDetails[factura.id]?.ClienteNombre || 'Cargando...'}
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

export default Mensajeria;