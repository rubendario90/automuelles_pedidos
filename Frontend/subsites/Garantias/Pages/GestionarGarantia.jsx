import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../src/context/AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/navbar';
import axios from '../../../src/api/axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../assets/GestionarGarantia.css';

const GestionarGarantia = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [garantiaDetails, setGarantiaDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [observaciones, setObservaciones] = useState('');

  useEffect(() => {
    const fetchGarantiaDetails = async () => {
      try {
        const response = await axios.post('/api/garantia-details', {
          transaccion: location.state?.transaccion,
          documento: location.state?.documento,
        });
        setGarantiaDetails(response.data);
      } catch {
        setError('Error al cargar los detalles de la garantía.');
      } finally {
        setLoading(false);
      }
    };

    if (location.state?.transaccion && location.state?.documento) {
      fetchGarantiaDetails();
    } else {
      setError('No se encontró información de la garantía.');
      setLoading(false);
    }
  }, [location.state]);

  const handleSubmit = async () => {
    try {
      await axios.post('/api/actualizar-garantia', {
        transaccion: location.state?.transaccion,
        documento: location.state?.documento,
        observaciones: observaciones,
        user_id: user.id,
      });
      alert('Garantía actualizada correctamente.');
      navigate('/Garantias');
    } catch (error) {
      alert('Error al actualizar la garantía.');
      console.error(error);
    }
  };

  if (loading) return <p>Cargando...</p>;
  if (error) return <p className="text-danger">{error}</p>;

  return (
    <div className="garantia-container">
      <Navbar />
      <div className="main-content">
        <div className="container mt-4">
          <h2 className="fw-bold text-center mb-4">Gestionar Garantía</h2>
          {garantiaDetails && garantiaDetails.length > 0 && (
            <>
              <div className="garantia-header">
                <div>
                  <h3><strong>Transacción:</strong> {garantiaDetails[0]?.IntTransaccion}</h3>
                  <p><strong>Fecha:</strong> {new Date(garantiaDetails[0]?.DatFecha1).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="garantia-references">
                <p><strong>Cliente:</strong> {garantiaDetails[0]?.ClienteNombre}</p>
                <p><strong>Producto:</strong> {garantiaDetails[0]?.Producto}</p>
                <p><strong>Observaciones:</strong> {garantiaDetails[0]?.StrObservaciones}</p>
              </div>

              <div className="garantia-info">
                <p><strong>Cliente ID:</strong> {garantiaDetails[0]?.StrTercero}</p>
                <p><strong>Vendedor:</strong> {garantiaDetails[0]?.StrUsuarioGra}</p>
              </div>

              <div className="form-group mt-4">
                <label htmlFor="observaciones"><strong>Agregar Observaciones:</strong></label>
                <textarea
                  id="observaciones"
                  className="form-control"
                  rows="4"
                  value={observaciones}
                  onChange={(e) => setObservaciones(e.target.value)}
                  placeholder="Ingrese observaciones sobre la garantía..."
                />
              </div>

              <div className="text-center mt-4">
                <button className="btn btn-success me-2" onClick={handleSubmit}>
                  Guardar
                </button>
                <button className="btn btn-secondary" onClick={() => navigate('/Garantias')}>
                  Cancelar
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default GestionarGarantia;
