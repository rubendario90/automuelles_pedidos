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


    const handleSubmit = async () => {
        const allChecked = documentDetails.every((_, index) => checkedItems[index]);
        if (!allChecked) {
            alert('Debe seleccionar todos los productos antes de continuar.');
            return;
        }

        try {
            const response = await axios.post('/api/actualizar-estado-Despachos', {
                factura_id: factura.factura_id,
                transaccion: factura.transaccion,
                user_id: user.id,
            });

            alert(response.data.message);
            navigate('/Despachos/asignar-pedidos', { state: { factura } });
        } catch (error) {
            console.error('Error al actualizar el estado:', error.response?.data || error.message);
            alert('Ocurrió un error al actualizar el estado.');
        }
    };

    return (
        <div className="Mostrador-container">
            <Navbar />
            <div className="main-content container mt-5">
                {loading ? (
                    <p className="text-center">Cargando detalles...</p>
                ) : error ? (
                    <p className="text-danger text-center">{error}</p>
                ) : documentDetails && documentDetails.length > 0 ? (
                    <>
                        <div className="Mostrador-header">
                            <div className="right">
                                <h3><strong>Factura:</strong> {documentDetails[0]?.IntDocumento}</h3>
                                <h3><strong>Transacción:</strong> {documentDetails[0]?.IntTransaccion}</h3>
                                <p><strong>Fecha:</strong> {new Date(documentDetails[0]?.DatFecha1).toLocaleDateString()}</p>
                            </div>
                        </div>

                        <div className="Mostrador-references">
                            <p><strong>Enviar A:</strong> {documentDetails[0]?.StrReferencia1}</p>
                            <p><strong>Metodo de Pago:</strong> {documentDetails[0]?.StrReferencia3}</p>
                            <p><strong>Observaciones:</strong> {documentDetails[0]?.StrObservaciones}</p>
                        </div>

                        <div className="Mostrador-info">
                            <p><strong>Cliente ID:</strong> {documentDetails[0]?.StrTercero}</p>
                            <p><strong>Nombre:</strong> {documentDetails[0]?.ClienteNombre}</p>
                            <p><strong>Vendedor:</strong> {documentDetails[0]?.StrUsuarioGra}</p>
                        </div>

                        <table className="Mostrador-table">
                            <thead>
                                <tr>
                                    <th>Seleccionar</th>
                                    <th>Descripción</th>
                                    <th>Cantidad</th>
                                    <th>Producto</th>

                                </tr>
                            </thead>
                            <tbody>
                                {documentDetails.map((detalle, index) => (
                                    <tr key={index}>
                                        <td data-label="Seleccionar">
                                            <input
                                                type="checkbox"
                                                checked={checkedItems[index] || false}
                                                onChange={() => handleCheckboxChange(index)}
                                            />
                                        </td>
                                        <td data-label="Descripción">{detalle.StrDescripcion}</td>
                                        <td data-label="Cantidad">
                                            {parseFloat(detalle.IntCantidad.replace(',', '.')).toFixed(2)}
                                        </td>
                                        <td data-label="Producto">{detalle.StrProducto}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </>
                ) : (
                    <p className="text-muted text-center">No hay detalles disponibles para esta factura.</p>
                )}
            </div>
        </div>
    );
};

export default GestionarFactura;