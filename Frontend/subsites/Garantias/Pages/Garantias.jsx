import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/navbar';
import axios from '../../../src/api/axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../assets/Garantias.css';

const Garantias = () => {
  const [garantias, setGarantias] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGarantias = async () => {
      try {
        // Llama a la API para obtener todas las garantías
        const response = await axios.get('/api/garantias', { withCredentials: true });
        setGarantias(response.data);
      } catch (error) {
        console.error('Error al obtener las garantías:', error.response?.data || error.message);
        setError('Error al cargar las garantías.');
      }
    };
    fetchGarantias();
  }, []);

  const handleGestionarClick = (garantia) => {
    navigate('/Garantias/gestionar-garantia', { 
      state: { 
        transaccion: garantia.IntTransaccion, 
        documento: garantia.IntDocumento 
      } 
    });
  };

  return (
    <div className="garantias-container">
      <Navbar />
      <div className="main-content">
        <div className="container mt-4">
          <h2 className="fw-bold text-center mb-4 text-custom-color">🛡️ Gestión de Garantías</h2>
          {error && <p className="text-danger text-center">{error}</p>}
          <div className="row">
            {garantias.length > 0 ? (
              garantias.map((garantia) => (
                <div className="col-12 col-sm-6 col-md-4 mb-4" key={`${garantia.IntTransaccion}-${garantia.IntDocumento}`}>
                  <div className="card text-center shadow-sm">
                    <div className="card-header bg-custom text-white">Documento: {garantia.IntDocumento}</div>
                    <div className="card-body">
                      <h5 className="card-title text-primary">Transacción: {garantia.IntTransaccion}</h5>
                      <p className="card-text">
                        <strong>Cliente:</strong> {garantia.ClienteNombre || 'N/A'}
                      </p>
                      <p className="card-text">
                        <strong>Producto:</strong> {garantia.Producto || 'N/A'}
                      </p>
                      <p className="card-text">
                        <strong>Fecha:</strong> {garantia.DatFecha1 ? new Date(garantia.DatFecha1).toLocaleDateString() : 'N/A'}
                      </p>
                      <button
                        className="btn btn-custom btn-sm"
                        onClick={() => handleGestionarClick(garantia)}
                      >
                        Gestionar
                      </button>
                    </div>
                    <div className="card-footer text-muted">
                      Estado: {garantia.Estado || 'Pendiente'}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-12 text-center">
                <p className="text-muted">No hay garantías registradas.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Garantias;
