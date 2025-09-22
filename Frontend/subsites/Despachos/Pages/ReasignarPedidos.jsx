import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/navbar';
import axios from '../../../src/api/axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../assets/ReasignarPedidos.css';
import { useAuth } from '../../../src/context/AuthContext';

const ReasignarPedidos = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [facturas, setFacturas] = useState([]);
  const [selectedFactura, setSelectedFactura] = useState(null);
  const [documentDetails, setDocumentDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Para reasignar mensajero
  const [usuarios, setUsuarios] = useState([]);
  const [selectedMensajero, setSelectedMensajero] = useState('');

  useEffect(() => {
    const fetchPickingFacturas = async () => {
      try {
        const response = await axios.get('/api/facturas/mensajero-asignado');
        setFacturas(response.data);
      } catch (err) {
        console.error('Error fetching picking facturas:', err.response?.data || err.message);
        setError('Error al cargar las facturas en estado picking.');
      } finally {
        setLoading(false);
      }
    };

    fetchPickingFacturas();
  }, []);

  useEffect(() => {
    if (selectedFactura) {
      axios.get('/api/usuarios-mensajeria').then(res => setUsuarios(res.data));
    }
  }, [selectedFactura]);

  const fetchDocumentDetails = async (factura) => {
    setLoading(true);
    setSelectedFactura(factura);
    try {
      const response = await axios.post('/api/facturas/picking/details', {
        transaccion: factura.transaccion,
        documento: factura.documento,
      });
      setDocumentDetails(response.data);
    } catch (err) {
      console.error('Error fetching document details:', err.response?.data || err.message);
      setError('Error al cargar los detalles del documento.');
    } finally {
      setLoading(false);
    }
  };

  const handleBackToFacturas = () => {
    setSelectedFactura(null);
    setDocumentDetails(null);
    setSelectedMensajero('');
  };

  const handleReasignarMensajero = async () => {
    if (!selectedMensajero) {
      alert('Seleccione un mensajero');
      return;
    }
    await axios.post('/api/asignar-mensajero', {
      factura_id: selectedFactura.factura_id,
      transaccion: selectedFactura.transaccion,
      user_id: selectedMensajero,
    });
    alert('Mensajero reasignado correctamente');
    setSelectedFactura(null);
    setDocumentDetails(null);
    setSelectedMensajero('');
    window.location.reload();
  };

  return (
    <div className="Despachos-container">
      <Navbar />
      <div className="main-content container mt-5">
        {loading ? (
          <p className="text-center">Cargando...</p>
        ) : error ? (
          <p className="text-danger text-center">{error}</p>
        ) : selectedFactura && documentDetails ? (
          <>
            <div className="factura-header">
              <div className="right">
                <h3><strong>Factura:</strong> {documentDetails[0]?.IntDocumento}</h3>
                <h3><strong>Transacción:</strong> {documentDetails[0]?.IntTransaccion}</h3>
                <p><strong>Fecha:</strong> {new Date(documentDetails[0]?.DatFecha1).toLocaleDateString()}</p>
              </div>
            </div>

            <div className="factura-references">
              <p><strong>Enviar A:</strong> {documentDetails[0]?.StrReferencia1}</p>
              <p><strong>Metodo de Pago:</strong> {documentDetails[0]?.StrReferencia3}</p>
              <p><strong>Observaciones:</strong> {documentDetails[0]?.StrObservaciones}</p>
            </div>

            <div className="factura-info">
              <p><strong>Cliente ID:</strong> {documentDetails[0]?.StrTercero}</p>
              <p><strong>Nombre:</strong> {documentDetails[0]?.ClienteNombre}</p>
              <p><strong>Vendedor:</strong> {documentDetails[0]?.StrUsuarioGra}</p>
            </div>

            <table className="table table-hover align-middle table-bordered">
              <thead className="table-primary text-center">
                <tr>
                  <th>Descripción</th>
                  <th>Producto</th>
                  <th>Bodega</th>
                  <th>Cantidad</th>
                </tr>
              </thead>
              <tbody>
                {documentDetails.map((detalle, index) => (
                  <tr key={index}>
                    <td>{detalle.StrDescripcion}</td>
                    <td>{detalle.StrProducto}</td>
                    <td>{detalle.IntBodega}</td>
                    <td>{parseInt(detalle.IntCantidad, 10)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Sección para reasignar mensajero */}
            <div className="mb-4">
              <h5 className="fw-bold text-primary">Reasignar Mensajero</h5>
              <label className="form-label fw-bold">Seleccione un mensajero:</label>
              <select
                className="form-select"
                value={selectedMensajero}
                onChange={e => setSelectedMensajero(e.target.value)}
              >
                <option value="">Seleccione un mensajero</option>
                {usuarios.map(u => (
                  <option key={u.id} value={u.id}>{u.name}</option>
                ))}
              </select>
              <button className="btn btn-success mt-2" onClick={handleReasignarMensajero}>
                Reasignar Mensajero
              </button>
            </div>

            <button
              className="btn btn-secondary mt-3"
              style={{ marginRight: '10px' }}
              onClick={handleBackToFacturas}
            >
              Volver a Facturas
            </button>
          </>
        ) : facturas.length > 0 ? (
          <>
            <h2 className="text-center mb-4 text-primary">📋 Facturas Pendientes Por Reasignar</h2>
            <div className="table-responsive shadow-sm rounded-3">
              <table className="table table-hover align-middle table-bordered">
                <thead className="table-primary text-center">
                  <tr>
                    <th>Factura ID</th>
                    <th>Transacción</th>
                    <th>Documento</th>
                    <th>Usuario</th>
                    <th>Estado</th>
                    <th>Última Actualización</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {facturas.map((factura) => (
                    <tr key={factura.factura_id}>
                      <td>{factura.factura_id}</td>
                      <td>{factura.transaccion}</td>
                      <td>{factura.documento}</td>
                      <td>{factura.user_name}</td>
                      <td>{factura.estado}</td>
                      <td>{new Date(factura.updated_at).toLocaleString()}</td>
                      <td>
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => fetchDocumentDetails(factura)}
                        >
                          Ver Detalles
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <p className="text-muted text-center">No hay facturas en estado picking.</p>
        )}
      </div>
    </div>
  );
};

export default ReasignarPedidos;