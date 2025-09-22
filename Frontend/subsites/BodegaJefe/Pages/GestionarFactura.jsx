import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../src/context/AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/navbar';
import axios from '../../../src/api/axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../assets/GestionarFactura.css';

const GestionarFactura = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const factura = location.state?.factura;
  const [documentDetails, setDocumentDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [checkedItems, setCheckedItems] = useState({});
  const [temporarySaved, setTemporarySaved] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const fetchDocumentDetails = async () => {
      try {
        const response = await axios.post('/api/document-details', {
          transaccion: factura?.transaccion,
          documento: factura?.documento,
        });
        setDocumentDetails(response.data);
      } catch (err) {
        console.error('Error fetching document details:', err.response?.data || err.message);
        setError('Error al cargar los detalles del documento.');
      } finally {
        setLoading(false);
      }
    };

    if (factura) {
      fetchDocumentDetails();
    } else {
      setError('No se encontró información de la factura.');
      setLoading(false);
    }
  }, [factura]);

  const handleCheckboxChange = (index) => {
    setCheckedItems((prevState) => ({
      ...prevState,
      [index]: !prevState[index],
    }));
  };

  const handleSaveTemporary = () => {
    if (!documentDetails) return;

    const selectedProducts = documentDetails.filter((_, index) => checkedItems[index]);
    const unselectedProducts = documentDetails.filter((_, index) => !checkedItems[index]);

    setTemporarySaved({
      transaccion: factura?.transaccion,
      documento: factura?.documento,
      selected: selectedProducts,
      unselected: unselectedProducts,
    });
    setModalVisible(true); // Mostrar el modal
  };

  const handleCloseModal = () => {
    setModalVisible(false); // Ocultar el modal
  };

  const handleSaveInModal = async () => {
    try {
      // Enviar los datos al backend para registrar el estado "entrega parcial"
      await axios.post('/api/registrar-entrega-parcial', {
        factura_id: factura.factura_id,
        transaccion: temporarySaved?.transaccion,
        user_id: user.id,
        productos_seleccionados: temporarySaved?.selected,
        productos_no_seleccionados: temporarySaved?.unselected,
      });

      alert('Estado "entrega parcial" registrado exitosamente.');
      setModalVisible(false); // Cerrar el modal después de guardar

      // Redirigir al inicio
      navigate('/bodega-jefe');
    } catch (error) {
      console.error('Error al guardar el estado "entrega parcial":', error.response?.data || error.message);
      alert('Ocurrió un error al guardar el estado.');
    }
  };

  const handleSubmit = async () => {
    const allChecked = documentDetails.every((_, index) => checkedItems[index]);
    if (!allChecked) {
      alert('Debe seleccionar todos los productos antes de continuar.');
      return;
    }

    try {
      const response = await axios.post('/api/actualizar-estado', {
        factura_id: factura.factura_id,
        transaccion: factura.transaccion,
        user_id: user.id,
      });

      alert(response.data.message);
      navigate('/bodega-jefe');
    } catch (error) {
      console.error('Error al actualizar el estado:', error.response?.data || error.message);
      alert('Ocurrió un error al actualizar el estado.');
    }
  };

  return (
    <div className="bodega-jefe-container">
      <Navbar />
      <div className="main-content container mt-5">
        {loading ? (
          <p className="text-center">Cargando detalles...</p>
        ) : error ? (
          <p className="text-danger text-center">{error}</p>
        ) : documentDetails && documentDetails.length > 0 ? (
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

            <table className="factura-table">
              <thead>
                <tr>
                  <th>Seleccionar</th>
                  <th>Descripción</th>
                  <th>Producto</th>
                  <th>Bodega</th>
                  <th>ubicacion</th>
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
                    <td>{detalle.StrParam1}</td>
                    <td data-label="Cantidad">
                      {parseFloat(detalle.IntCantidad.replace(',', '.')).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button className="btn btn-primary mt-3 me-2" onClick={handleSaveTemporary}>
              Entrega Parcial
            </button>
            <button className="btn btn-success mt-3" onClick={handleSubmit}>
              Entrega Total
            </button>

            {/* Modal para mostrar productos guardados temporalmente */}
            {modalVisible && (
              <div className="modal show d-block" tabIndex="-1" role="dialog">
                <div className="modal-dialog modal-lg" role="document">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h5 className="modal-title">Productos Guardados Temporalmente</h5>
                      <button type="button" className="btn-close" onClick={handleCloseModal}></button>
                    </div>
                    <div className="modal-body">
                      <p><strong>Transacción:</strong> {temporarySaved?.transaccion}</p>
                      <p><strong>Documento:</strong> {temporarySaved?.documento}</p>

                      <h4>Productos Seleccionados</h4>
                      <table className="table table-bordered">
                        <thead>
                          <tr>
                            <th>Descripción</th>
                            <th>Producto</th>
                            <th>Bodega</th>
                            <th>Cantidad</th>
                          </tr>
                        </thead>
                        <tbody>
                          {temporarySaved?.selected.map((detalle, index) => (
                            <tr key={index}>
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

                      <h4>Productos No Seleccionados</h4>
                      <table className="table table-bordered">
                        <thead>
                          <tr>
                            <th>Descripción</th>
                            <th>Producto</th>
                            <th>Bodega</th>
                            <th>Cantidad</th>
                          </tr>
                        </thead>
                        <tbody>
                          {temporarySaved?.unselected.map((detalle, index) => (
                            <tr key={index}>
                              <td>{detalle.StrDescripcion}</td>
                              <td>{detalle.StrProducto}</td>
                              <td>{detalle.IntBodega}</td>
                              <td>{parseInt(detalle.IntCantidad, 10)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div className="modal-footer">
                      <button type="button" className="btn btn-primary" onClick={handleSaveInModal}>
                        Guardar
                      </button>
                      <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
                        Cerrar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          <p className="text-muted text-center">No hay detalles disponibles para esta factura.</p>
        )}
      </div>
    </div>
  );
};

export default GestionarFactura;