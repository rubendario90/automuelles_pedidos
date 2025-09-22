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

  useEffect(() => {
    const fetchDocumentDetails = async () => {
      try {
        const response = await axios.post('/api/document-details', {
          transaccion: factura?.transaccion,
          documento: factura?.documento,
        });
        setDocumentDetails(response.data);
      } catch (err) {
        setError('Error al cargar los detalles del documento.');
      } finally {
        setLoading(false);
      }
    };
  
    if (factura?.transaccion && factura?.documento) {
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

  const handleSubmit = () => {
    const allChecked = documentDetails.every((_, index) => checkedItems[index]);
    if (!allChecked) {
      alert('Debe seleccionar todos los productos antes de continuar.');
      return;
    }
    // Redirige a la página de firma y pasa la factura y los detalles
    navigate('/Mensajeria/firma', {
      state: { 
        factura: {
          documento: documentDetails[0]?.IntDocumento, // número de documento
          transaccion: documentDetails[0]?.IntTransaccion, // transacción
          // otros datos si los necesitas
        }
      }
    });
  };

  return (
    <div className="Mensajeria-container">
      <Navbar />
      <div className="Mensajeria-content container mt-5">
        {loading ? (
          <p className="text-center">Cargando detalles...</p>
        ) : error ? (
          <p className="text-danger text-center">{error}</p>
        ) : documentDetails && documentDetails.length > 0 ? (
          <>
            <div className="Mensajeria-header">
              <div className="right">
                <h3><strong>Factura:</strong> {documentDetails[0]?.IntDocumento}</h3>
                <h3><strong>Transacción:</strong> {documentDetails[0]?.IntTransaccion}</h3>
                <p><strong>Fecha:</strong> {new Date(documentDetails[0]?.DatFecha1).toLocaleDateString()}</p>
              </div>
            </div>

            <div className="Mensajeria-references">
              <p><strong>Enviar A:</strong> {documentDetails[0]?.StrReferencia1}</p>
              <p><strong>Metodo de Pago:</strong> {documentDetails[0]?.StrReferencia3}</p>
              <p><strong>Observaciones:</strong> {documentDetails[0]?.StrObservaciones}</p>
            </div>

            <div className="Mensajeria-info">
              <p><strong>Cliente ID:</strong> {documentDetails[0]?.StrTercero}</p>
              <p><strong>Nombre:</strong> {documentDetails[0]?.ClienteNombre}</p>
              <p><strong>Vendedor:</strong> {documentDetails[0]?.StrUsuarioGra}</p>
            </div>

            <table className="Mensajeria-table">
              <thead>
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
                    <td>
                      <input
                        type="checkbox"
                        checked={checkedItems[index] || false}
                        onChange={() => handleCheckboxChange(index)}
                      />
                    </td>
                    <td>{detalle.StrDescripcion}</td>
                    <td>{detalle.StrProducto}</td>
                    <td data-label="Cantidad">
                                {parseFloat(detalle.IntCantidad.replace(',', '.')).toFixed(2)}
                              </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <button className="btn btn-success mt-3" onClick={handleSubmit}>
              Entrega Total
            </button>
          </>
        ) : (
          <p className="text-muted text-center">No hay detalles disponibles para esta factura.</p>
        )}
      </div>
    </div>
  );
};

export default GestionarFactura;