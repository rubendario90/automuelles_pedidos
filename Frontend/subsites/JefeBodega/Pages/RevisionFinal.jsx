import React, { useState, useEffect } from 'react';
import axios from '../../../src/api/axios';
import 'bootstrap/dist/css/bootstrap.min.css';
// import '../assets/GestionarFactura.css';
import { useAuth } from '../../../src/context/AuthContext';

const RevisionFinal = () => {
  const { user } = useAuth();
  const [facturas, setFacturas] = useState([]);
  const [selectedFactura, setSelectedFactura] = useState(null);
  const [documentDetails, setDocumentDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [checkedItems, setCheckedItems] = useState({});

  const fetchPickingFacturas = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/facturas/picking');
      setFacturas(response.data);
    } catch (err) {
      console.error('Error fetching picking facturas:', err.response?.data || err.message);
      setError('Error al cargar las facturas en estado picking.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPickingFacturas();
  }, []);

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
    setCheckedItems({});
  };

  const handleCheckboxChange = (index) => {
    setCheckedItems((prevState) => ({
      ...prevState,
      [index]: !prevState[index],
    }));
  };

  const handleConfirmSelection = async () => {
    const selectedFacturas = Object.keys(checkedItems)
      .filter((key) => checkedItems[key])
      .map((key) => facturas[key]);

    if (selectedFacturas.length === 0) {
      alert('Debe seleccionar al menos una factura.');
      return;
    }

    try {
      for (const factura of selectedFacturas) {
        await axios.post('/api/actualizar-estado-revision-final', {
          factura_id: factura.factura_id,
          transaccion: factura.transaccion,
          user_id: user.id,
        });
      }

      alert('Facturas actualizadas correctamente.');
      setSelectedFactura(null);
      setDocumentDetails(null);
      setCheckedItems({});
      fetchPickingFacturas();
    } catch (error) {
      console.error('Error al actualizar las facturas:', error.response?.data || error.message);
      alert('Ocurrió un error al actualizar las facturas.');
    }
  };

  return (
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
                <th>Seleccionar</th>
                <th>Descripción</th>
                <th>Producto</th>
                <th>Bodega</th>
                <th>Cantidad</th>
              </tr>
            </thead>
            <tbody>
              {documentDetails.map((detalle, index) => (
                <tr key={index}>
                  <td>
                    <input
                      type="checkbox"
                      checked={checkedItems[index] || false}
                      onChange={() => handleCheckboxChange(index)}
                    />
                  </td>
                  <td>{detalle.StrDescripcion}</td>
                  <td>{detalle.StrProducto}</td>
                  <td>{detalle.IntBodega}</td>
                  <td data-label="Cantidad">
                    {parseFloat(detalle.IntCantidad.replace(',', '.')).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button
            className="btn btn-secondary mt-3"
            style={{ marginRight: '10px' }}
            onClick={handleBackToFacturas}
          >
            Volver a Facturas
          </button>
          <button
            className="btn btn-success mt-3"
            onClick={handleConfirmSelection}
            disabled={Object.keys(checkedItems).length === 0}
          >
            Entrega Total
          </button>
        </>
      ) : facturas.length > 0 ? (
        <>
          <h2 className="text-center mb-4 text-primary">📋 Facturas Pendientes Por Revision</h2>
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
  );
};

export default RevisionFinal;