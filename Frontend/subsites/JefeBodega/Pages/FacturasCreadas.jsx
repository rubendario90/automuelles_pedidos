import React, { useState, useEffect } from 'react';
import axios from '../../../src/api/axios';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Sidebar } from 'lucide-react';

const Historial = () => {
  const [facturas, setFacturas] = useState([]);
  const [filteredFacturas, setFilteredFacturas] = useState([]);
  const [filterDate, setFilterDate] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedFactura, setSelectedFactura] = useState(null); // To store detailed info of the selected factura
  const [modalVisible, setModalVisible] = useState(false); // To control modal visibility
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthAndFetch = async () => {
      try {
        await axios.get('/api/user');
        setIsAuthenticated(true);

        const response = await axios.get('/api/facturas', { withCredentials: true });
        setFacturas(response.data);
        setFilteredFacturas(response.data); // Initially show all invoices
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
      await axios.delete(`/api/facturas/${id}`, {
        withCredentials: true,
      });
      setFacturas(facturas.filter((factura) => factura.id !== id));
      setFilteredFacturas(filteredFacturas.filter((factura) => factura.id !== id));
    } catch (error) {
      if (error.response) {
        console.error('Error del servidor:', error.response.data);
        alert(`Error: ${error.response.data.error || 'No autorizado'}`);
      } else {
        console.error('Error inesperado:', error);
      }
    }
  };

  const handleFilterChange = async (e) => {
    const selectedDate = e.target.value;
    setFilterDate(selectedDate);

    try {
      const response = await axios.get('/api/facturas', {
        params: { date: selectedDate }, // Send the date as a parameter
      });
      setFilteredFacturas(response.data);
    } catch (error) {
      console.error('Error al filtrar facturas:', error);
      alert('No se pudieron filtrar las facturas.');
    }
  };

  const viewFactura = async (factura) => {
    try {
      const response = await axios.get(`/api/facturas/${factura.id}/details`, { withCredentials: true });
      setSelectedFactura(response.data); // Set the detailed data
      setModalVisible(true); // Show the modal
    } catch (error) {
      console.error('Error al obtener detalles de la factura:', error);
      alert('No se pudieron obtener los detalles de la factura.');
    }
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedFactura(null);
  };

  return (
    <div>
      <Sidebar /> 
      <div className="container mt-4">
        <div className="text-center mb-4">
          <h2 className="fw-bold text-primary">📜 Historial de Facturas</h2>
          <p className="text-muted">Consulta y administra el historial de facturas</p>
        </div>

        {/* Filter by date */}
        <div className="mb-4 d-flex justify-content-center">
          <input
            type="date"
            className="form-control w-auto"
            value={filterDate}
            onChange={handleFilterChange}
          />
        </div>

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
                    <td className="text-center fw-semibold">{factura.transaccion}</td>
                    <td className="text-center">{factura.documento}</td>
                    <td className="text-center">{factura.estado}</td>
                    <td className="text-center">{new Date(factura.created_at).toLocaleDateString()}</td>
                    <td className="text-center">
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

      {/* Modal for displaying detailed factura info */}
      {modalVisible && selectedFactura && (
        <div className="modal show d-block" tabIndex="-1" role="dialog">
          <div className="modal-dialog modal-lg" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Detalles de la Factura</h5>
                <button type="button" className="btn-close" onClick={closeModal}></button>
              </div>
              <div className="modal-body">
                {/* Información principal de la factura */}
                <p><strong>Transacción:</strong> {selectedFactura.factura.transaccion}</p>
                <p><strong>Documento:</strong> {selectedFactura.factura.documento}</p>
                <p>
                  <strong>Fecha de Creación:</strong>{" "}
                  {new Date(new Date(selectedFactura.factura.created_at).setHours(new Date(selectedFactura.factura.created_at).getHours() + 5)).toLocaleString()}
                </p>

                {/* Información de la asignación */}
                {selectedFactura.asignacion ? (
                  <>
                    <p>
                      <strong>Asignada a:</strong>{" "}
                      {selectedFactura.assigned_user ? selectedFactura.assigned_user.name : "No asignada"}
                    </p>
                  </>
                ) : (
                  <p>
                    <strong>Asignación:</strong> No asignada
                  </p>
                )}

                {/* Historial de cambios */}
                <p>
                  <strong>Historial de Cambios:</strong>
                </p>
                <ul>
                  {selectedFactura.status_logs.length > 0 ? (
                    selectedFactura.status_logs.map((log) => (
                      <li key={log.id}>
                        <strong>Estado:</strong> {log.new_status} -{" "}
                        <strong>Fecha:</strong>{" "}
                        {new Date(log.changed_at).toLocaleString()} -{" "}
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