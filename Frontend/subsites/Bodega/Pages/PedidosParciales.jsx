import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/navbar';
import axios from '../../../src/api/axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../assets/GestionarFactura.css';

const PedidosParciales = () => {
  const navigate = useNavigate();
  const [facturas, setFacturas] = useState([]);
  const [selectedFactura, setSelectedFactura] = useState(null);
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [checklist, setChecklist] = useState([]);
  const [usuarios, setUsuarios] = useState([]);

  useEffect(() => {
    const fetchPartialDeliveryFacturas = async () => {
      try {
        const response = await axios.get('/api/entrega-parcial');
        setFacturas(response.data);
      } catch (err) {
        console.error('Error fetching facturas:', err.response?.data || err.message);
        setError('Error al cargar las facturas.');
      } finally {
        setLoading(false);
      }
    };

    fetchPartialDeliveryFacturas();
  }, []);

  const fetchProductos = (factura) => {
    setSelectedFactura(factura);
    try {
      const productosParsed = JSON.parse(factura.productos);
      setProductos(productosParsed);
      // Si el producto está entregado, el checklist debe estar en true
      setChecklist(productosParsed.map(p => p.estado === 'entregado'));
    } catch (err) {
      console.error('Error parsing productos JSON:', err.message);
      setError('Error al procesar los productos de la factura.');
    }
  };

  const handleChecklistChange = (index) => {
    setChecklist((prev) => {
      const updated = [...prev];
      updated[index] = !updated[index];
      return updated;
    });
  };

  const allChecked = checklist.length > 0 && checklist.every(Boolean);

  useEffect(() => {
    // Cargar usuarios al montar el componente
    const fetchUsuarios = async () => {
      const response = await axios.get('/api/usuarios'); // Debes tener este endpoint
      setUsuarios(response.data);
    };
    fetchUsuarios();
  }, []);

  const handleGuardar = async () => {
    try {
      // Buscar el usuario por nombre
      const usuario = usuarios.find(u => u.name === selectedFactura.user_name);
      const userId = usuario ? usuario.id : null;

      if (!userId) {
        alert('No se encontró el usuario correspondiente');
        return;
      }

      const payload = {
        transaccion: parseInt(selectedFactura.transaccion),
        factura_id: parseInt(selectedFactura.factura_id),
        user_id: userId,
      };
      console.log(payload);
      await axios.post('/api/actualizar-estado-entrega-parcial', payload);
      alert('Checklist guardado y estado actualizado correctamente');
      setSelectedFactura(null);
      setProductos([]);
      setChecklist([]);
      const response = await axios.get('/api/entrega-parcial');
      setFacturas(response.data);
    } catch (err) {
      alert('Error al actualizar el estado');
    }
  };

  const handleBackToFacturas = () => {
    setSelectedFactura(null);
    setProductos([]);
    setChecklist([]);
  };

  return (
    <div className="bodega-jefe-container">
      <Navbar />
      <div className="main-content container mt-5">
        {loading ? (
          <p className="text-center">Cargando...</p>
        ) : error ? (
          <p className="text-danger text-center">{error}</p>
        ) : selectedFactura && productos.length > 0 ? (
          <>
            <h2 className="text-center mb-4 text-primary">📋 Detalles de la Factura</h2>
            <div className="factura-header mb-4">
              <h3><strong>Documento:</strong> {selectedFactura.documento}</h3>
              <h3><strong>Transacción:</strong> {selectedFactura.transaccion}</h3>
              <p><strong>Fecha:</strong> {new Date(selectedFactura.created_at).toLocaleDateString()}</p>

            </div>

            <div className="mt-4">
              <p><strong>Enviar A:</strong> {selectedFactura.StrReferencia1}</p>
              <p><strong>Vendedor:</strong> {selectedFactura.StrUsuarioGra}</p>
              <p><strong>Cliente:</strong> {selectedFactura.ClienteNombre}</p>
              <p><strong>Observaciones:</strong> {selectedFactura.StrObservaciones}</p>
            </div>


            <div className="table-responsive shadow-sm rounded-3">
              <table className="table table-hover align-middle table-bordered">
                <thead className="table-primary text-center">
                  <tr>
                    <th>Descripción</th>
                    <th>Cantidad</th>
                    <th>Producto</th>
                    <th>ubicacion</th>
                    <th>Estado</th>
                    <th>Bodega</th>
                    <th>Seleccionar</th>
                  </tr>
                </thead>
                <tbody>
                  {productos.map((producto, index) => (
                    <tr key={index}>
                      <td className="text-center align-middle">{producto.descripcion}</td>
                      <td className="text-center align-middle">
                        {producto.cantidad !== undefined && producto.cantidad !== null
                          ? Number(producto.cantidad).toFixed(2)
                          : '0.00'
                        }
                      </td>
                      <td className="text-center align-middle">{producto.producto}</td>
                      <td className="text-center align-middle">{producto.StrParam1}</td>
                      <td className="text-center align-middle">{producto.estado}</td>
                      <td className="text-center align-middle">{producto.bodega}</td>
                      <td className="text-center align-middle">
                        <input
                          type="checkbox"
                          checked={checklist[index] || false}
                          disabled={producto.estado === 'entregado'}
                          onChange={() => producto.estado !== 'entregado' && handleChecklistChange(index)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <button
              className="btn btn-success mt-3"
              onClick={handleGuardar}
              disabled={!allChecked}
            >
              Guardar
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
            <h2 className="text-center mb-4 text-primary">📋 Facturas Entregadas Parcialmente</h2>
            <div className="table-responsive shadow-sm rounded-3">
              <table className="table table-hover align-middle table-bordered">
                <thead className="table-primary text-center">
                  <tr>
                    <th>Factura ID</th>
                    <th>Transacción</th>
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
                      <td className="text-center align-middle">{factura.user_name}</td>
                      <td className="text-center align-middle">{new Date(factura.created_at).toLocaleDateString()}</td>
                      <td className="text-center align-middle">
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => fetchProductos(factura)}
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
          <p className="text-muted text-center">No hay facturas en estado entrega parcial.</p>
        )}
      </div>
    </div>
  );
};

export default PedidosParciales;