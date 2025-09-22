import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/navbar';
import axios from '../../../src/api/axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../assets/GestionarFacturaDespachos.css';
import { useAuth } from '../../../src/context/AuthContext';

const PedidosEntregados = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [facturas, setFacturas] = useState([]);
  const [selectedFactura, setSelectedFactura] = useState(null);
  const [documentDetails, setDocumentDetails] = useState([]);
  const [numeroDocumento, setNumeroDocumento] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [checklist, setChecklist] = useState([]);

  useEffect(() => {
    const fetchMisPedidos = async () => {
      try {
        const response = await axios.get(`/api/mis-pedidos-mensajero/${user.id}`);
        setFacturas(response.data);
      } catch (err) {
        setError('Error al cargar los pedidos.');
      } finally {
        setLoading(false);
      }
    };
    fetchMisPedidos();
  }, [user.id]);

  const fetchDocumentDetails = async (factura) => {
    setSelectedFactura(factura);
    setLoading(true);
    try {
      const response = await axios.post('/api/document-details', {
        transaccion: factura.transaccion,
        documento: factura.documento,
      });
      setDocumentDetails(response.data);
      setChecklist(response.data.map(() => false)); // Inicializa el checklist
    } catch (err) {
      setError('Error al cargar los detalles del documento.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchNumeroDocumento = async () => {
      if (selectedFactura) {
        try {
          const response = await axios.get(`/api/factura-documento/${selectedFactura.factura_id}`);
          setNumeroDocumento(response.data.documento);
        } catch (err) {
          setNumeroDocumento('');
        }
      }
    };
    fetchNumeroDocumento();
  }, [selectedFactura]);

  const handleChecklistChange = (index) => {
    setChecklist((prev) => {
      const updated = [...prev];
      updated[index] = !updated[index];
      return updated;
    });
  };

  const allChecked = checklist.length > 0 && checklist.every(Boolean);

  const handleEntregar = async () => {
    if (!allChecked) {
      alert('Debes seleccionar todos los productos antes de continuar.');
      return;
    }
    try {
      await axios.post('/api/actualizar-estado-entregado', {
        documento: Number(selectedFactura.documento),      // integer
        transaccion: Number(selectedFactura.transaccion),  // integer
        user_id: Number(user.id),                          // integer
        signature: '',                                     // string (puede ser vacío)
      });
      alert('Factura marcada como entregada');
      setSelectedFactura(null);
      setDocumentDetails([]);
      setChecklist([]);
      const response = await axios.get(`/api/mis-pedidos-mensajero/${user.id}`);
      setFacturas(response.data);
    } catch (err) {
      alert('Error al actualizar el estado');
    }
  };

  const handleBackToFacturas = () => {
    setSelectedFactura(null);
    setDocumentDetails([]);
    setChecklist([]);
  };

  return (
    <div className="PedidosEntregados-container">
      <Navbar />
      <div className="PedidosEntregados-main container mt-5">
        {loading ? (
          <p className="text-center">Cargando...</p>
        ) : error ? (
          <p className="text-danger text-center">{error}</p>
        ) : selectedFactura && documentDetails.length > 0 ? (
          <>
            <h2 className="text-center mb-4 text-primary">📋 Detalles de la Factura</h2>
            <div className="factura-header mb-4">
              <h3>
                <strong>Factura ID:</strong> {selectedFactura.factura_id}
                <br />
                <strong>Número de Documento:</strong> {numeroDocumento}
              </h3>
              <h3><strong>Transacción:</strong> {selectedFactura.transaccion}</h3>
              <p><strong>Fecha:</strong> {new Date(selectedFactura.created_at).toLocaleDateString()}</p>
            </div>
            <div className="table-responsive shadow-sm rounded-3">
              <table className="table table-hover align-middle table-bordered">
                <thead className="table-primary text-center">
                  <tr>
                  <th>Seleccionar</th>
                    <th>Descripción</th>
                    <th>Producto</th>
                    <th>Cantidad</th>
             
                  </tr>
                </thead>
                <tbody>
                  {documentDetails.map((detalle, index) => (
                    <tr key={index}>
                      <td className="text-center align-middle">
                        <input
                          type="checkbox"
                          checked={checklist[index] || false}
                          onChange={() => handleChecklistChange(index)}
                        />
                      </td>
                      <td className="text-center align-middle">{detalle.StrDescripcion}</td>
                      <td className="text-center align-middle">{detalle.StrProducto}</td>
                      <td className="text-center align-middle">{parseFloat(detalle.IntCantidad.replace(',', '.')).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button
              className="btn btn-success mt-3"
              onClick={handleEntregar}
              disabled={!allChecked}
            >
              Marcar como Entregado
            </button>
            <button
              className="btn btn-secondary mt-3 ms-2"
              onClick={handleBackToFacturas}
            >
              Volver a Facturas
            </button>
          </>
        ) : facturas.length > 0 ? (
          <>
            <h2 className="text-center mb-4 text-primary">📋 Mis Pedidos Asignados</h2>
            <div className="table-responsive shadow-sm rounded-3">
              <table className="table table-hover align-middle table-bordered">
                <thead className="table-primary text-center">
                  <tr>
                    <th>Factura ID</th>
                    <th>Transacción</th>
                    <th>Documento</th>
                    <th>Usuario</th>
                    <th>Fecha</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {facturas.map((factura) => (
                    <tr key={factura.id}>
                      <td className="text-center align-middle">{factura.factura_id}</td>
                      <td className="text-center align-middle">{factura.transaccion}</td>
                      <td className="text-center align-middle">{factura.documento}</td>
                      <td className="text-center align-middle">{factura.user_name}</td>
                      <td className="text-center align-middle">{new Date(factura.created_at).toLocaleDateString()}</td>
                      <td className="text-center align-middle">
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => fetchDocumentDetails(factura)}
                        >
                          Ver Productos
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <p className="text-muted text-center">No tienes pedidos asignados pendientes de entrega.</p>
        )}
      </div>
    </div>
  );
};

export default PedidosEntregados;