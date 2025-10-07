import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/navbar';
import axios from '../../../src/api/axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../assets/Historial.css';

const Historial = () => {
  const [historial, setHistorial] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHistorial = async () => {
      try {
        const response = await axios.get('/api/garantias-historial', { withCredentials: true });
        setHistorial(response.data);
      } catch (error) {
        console.error('Error al obtener el historial:', error.response?.data || error.message);
        setError('Error al cargar el historial de garantías.');
      }
    };
    fetchHistorial();
  }, []);

  const handleVerDetalles = (garantia) => {
    navigate('/Garantias/gestionar-garantia', { 
      state: { 
        transaccion: garantia.IntTransaccion, 
        documento: garantia.IntDocumento 
      } 
    });
  };

  return (
    <div className="historial-container">
      <Navbar />
      <div className="main-content">
        <div className="container mt-4">
          <h2 className="fw-bold text-center mb-4">📜 Historial de Garantías</h2>
          {error && <p className="text-danger text-center">{error}</p>}
          <div className="table-responsive">
            <table className="table table-striped table-hover">
              <thead className="table-dark">
                <tr>
                  <th>Documento</th>
                  <th>Transacción</th>
                  <th>Cliente</th>
                  <th>Producto</th>
                  <th>Fecha</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {historial.length > 0 ? (
                  historial.map((garantia, index) => (
                    <tr key={index}>
                      <td>{garantia.IntDocumento}</td>
                      <td>{garantia.IntTransaccion}</td>
                      <td>{garantia.ClienteNombre || 'N/A'}</td>
                      <td>{garantia.Producto || 'N/A'}</td>
                      <td>{garantia.DatFecha1 ? new Date(garantia.DatFecha1).toLocaleDateString() : 'N/A'}</td>
                      <td>
                        <span className={`badge ${garantia.Estado === 'Completado' ? 'bg-success' : 'bg-warning'}`}>
                          {garantia.Estado || 'Pendiente'}
                        </span>
                      </td>
                      <td>
                        <button
                          className="btn btn-sm btn-primary"
                          onClick={() => handleVerDetalles(garantia)}
                        >
                          Ver Detalles
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center text-muted">
                      No hay historial de garantías disponible.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Historial;
