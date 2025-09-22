import React, { useState, useEffect } from 'react';
import axios from '../../../src/api/axios';

const Notificaciones = () => {
  const [facturas, setFacturas] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFacturasPendientes = async () => {
      try {
        const response = await axios.get('/api/facturas-pendientes', { withCredentials: true });
        setFacturas(response.data);
      } catch (error) {
        console.error('Error al obtener las facturas pendientes:', error.response?.data || error.message);
        setError('Error al cargar las facturas pendientes.');
      }
    };

    fetchFacturasPendientes();
  }, []);

  return (
    <div className="container mt-4">
      <h2 className="fw-bold text-primary">📋 Facturas Pendientes</h2>
      {error && <p className="text-danger">{error}</p>}
      <div className="table-responsive shadow-sm rounded-3 mt-3">
        <table className="table table-hover align-middle table-bordered">
          <thead className="table-primary text-center">
            <tr>
              <th>ID</th>
              <th>Transacción</th>
              <th>Documento</th>
              <th>Estado</th>
              <th>Fecha</th>
            </tr>
          </thead>
          <tbody>
            {facturas.length > 0 ? (
              facturas.map((factura) => (
                <tr key={factura.id}>
                  <td className="text-center">{factura.factura_id}</td>
                  <td className="text-center">{factura.transaccion}</td>
                  <td className="text-center">{factura.documento}</td>
                  <td className="text-center">{factura.estado}</td>
                  <td className="text-center">{new Date(factura.created_at).toLocaleDateString()}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center text-muted">
                  No tienes facturas pendientes.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Notificaciones;