import React, { useState, useEffect } from 'react';
import axios from '../../../src/api/axios';
import Navbar from '../components/navbar';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../assets/Historial.css'; // 👉 Importa tus estilos propios

const Historial = () => {
  const [facturas, setFacturas] = useState([]);
  const [filteredFacturas, setFilteredFacturas] = useState([]);
  const [filterDate, setFilterDate] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedFactura, setSelectedFactura] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthAndFetch = async () => {
      try {
        await axios.get('/api/user');
        setIsAuthenticated(true);

        const response = await axios.get('/api/facturas', { withCredentials: true });
        setFacturas(response.data);
        setFilteredFacturas(response.data);
      } catch (error) {
        console.error('Usuario no autenticado o error al obtener facturas:', error);
        setIsAuthenticated(false);
        navigate('/login');
      }
    };

    checkAuthAndFetch();
  }, [navigate]);

  const deleteFactura = async (id) => {
    try {
      await axios.delete(`/api/facturas/${id}`, { withCredentials: true });
      setFacturas(facturas.filter((factura) => factura.id !== id));
      setFilteredFacturas(filteredFacturas.filter((factura) => factura.id !== id));
    } catch (error) {
      if (error.response) {
        alert(`Error: ${error.response.data.error || 'No autorizado'}`);
      }
    }
  };

  const handleFilterChange = async (e) => {
    const selectedDate = e.target.value;
    setFilterDate(selectedDate);

    try {
      const response = await axios.get('/api/facturas', { params: { date: selectedDate } });
      setFilteredFacturas(response.data);
    } catch (error) {
      alert('No se pudieron filtrar las facturas.');
    }
  };

  const viewFactura = async (factura) => {
    try {
      const response = await axios.get(`/api/facturas/${factura.id}/details`, { withCredentials: true });
      setSelectedFactura(response.data);
      setModalVisible(true);
    } catch (error) {
      alert('No se pudieron obtener los detalles de la factura.');
    }
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedFactura(null);
  };

  return (
    <div className="Historial-container">
      <Navbar />
      <div className="historial-content">
        <div className="text-center mb-4">
          <h2 className="fw-bold text-primary">📜 Historial de Facturas</h2>
          <p className="text-muted">Consulta y administra el historial de facturas</p>
        </div>

        {/* Filtro */}
        <div className="mb-4 d-flex justify-content-center">
          <input
            type="date"
            className="form-control w-auto"
            value={filterDate}
            onChange={handleFilterChange}
          />
        </div>

        {/* Tabla */}
        <div className="table-responsive shadow-sm rounded-3">
          <table className="table table-hover align-middle table-bordered">
            <thead className="table-primary text-center">
              <tr>
                <th>Transacción</th>
                <th>Documento</th>
                <th>Estado</th>
                <th>Fecha</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredFacturas.length > 0 ? (
                filteredFacturas.map((factura) => (
                  <tr key={factura.id}>
                    <td data-label="Transacción" className="text-center fw-semibold">
                      {factura.transaccion}
                    </td>
                    <td data-label="Documento" className="text-center">
                      {factura.documento}
                    </td>
                    <td data-label="Estado" className="text-center">
                      {factura.estado}
                    </td>
                    <td data-label="Fecha" className="text-center">
                      {new Date(factura.created_at).toLocaleDateString()}
                    </td>
                    <td data-label="Acciones" className="text-center">
                      <button
                        className="btn btn-sm btn-outline-primary me-2"
                        onClick={() => viewFactura(factura)}
                      >
                        <i className="bi bi-eye"></i> Ver
                      </button>
                      {!([40, 42, 88, 90].includes(Number(factura.transaccion))) ? (
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => deleteFactura(factura.id)}
                        >
                          <i className="bi bi-trash3"></i> Eliminar
                        </button>
                      ) : (
                        <span className="text-muted">No disponible</span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center text-muted">
                    No hay facturas en el historial.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {modalVisible && selectedFactura && (
        <div className="modal show d-block" tabIndex="-1" role="dialog">
          <div className="modal-dialog modal-lg" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Detalles de la Factura</h5>
                <button type="button" className="btn-close" onClick={closeModal}></button>
              </div>
              <div className="modal-body">
                <p><strong>Transacción:</strong> {selectedFactura.factura.transaccion}</p>
                <p><strong>Documento:</strong> {selectedFactura.factura.documento}</p>
                <p>
                  <strong>Fecha de Creación:</strong>{" "}
                  {new Date(selectedFactura.factura.created_at).toLocaleString()}
                </p>

                {selectedFactura.asignacion ? (
                  <p>
                    <strong>Asignada a:</strong>{" "}
                    {selectedFactura.assigned_user ? selectedFactura.assigned_user.name : "No asignada"}
                  </p>
                ) : (
                  <p><strong>Asignación:</strong> No asignada</p>
                )}

                <p><strong>Historial de Cambios:</strong></p>
                <ul>
                  {selectedFactura.status_logs.length > 0 ? (
                    selectedFactura.status_logs.map((log) => (
                      <li key={log.id}>
                        <strong>Estado:</strong> {log.new_status} -{" "}
                        <strong>Fecha:</strong> {new Date(log.changed_at).toLocaleString()} -{" "}
                        <strong>Usuario:</strong> {log.user_name}
                      </li>
                    ))
                  ) : (
                    <li>No hay cambios registrados.</li>
                  )}
                </ul>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={closeModal}>Cerrar</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Historial;