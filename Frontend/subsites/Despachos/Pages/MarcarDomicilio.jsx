import React, { useState } from 'react';
import Navbar from '../components/navbar';
import axios from '../../../src/api/axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../assets/MarcarDomicilio.css'; // 👈 Importar estilos propios

const MarcarDomicilio = () => {
  const [transaccion, setTransaccion] = useState('');
  const [documento, setDocumento] = useState('');
  const [referencia1, setReferencia1] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus('');
    try {
      const response = await axios.post(
        '/api/documentos/update-referencia1',
        {
          transaccion: parseInt(transaccion, 10),
          documento: parseInt(documento, 10),
          referencia1,
        },
        { withCredentials: true }
      );
      setStatus(response.data.message);
    } catch (error) {
      setStatus(error.response?.data?.message || 'Error al actualizar');
    }
    setLoading(false);
  };

  return (
    <div className="MarcarDomicilio-container">
      <Navbar />
      <div className="MarcarDomicilio-main container mt-4">
        <h2>🏠 Marcar / Desmarcar Domicilio</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label>Transacción</label>
            <input
              type="number"
              className="form-control"
              value={transaccion}
              onChange={(e) => setTransaccion(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label>Documento</label>
            <input
              type="number"
              className="form-control"
              value={documento}
              onChange={(e) => setDocumento(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label>Referencia Domicilio (vacío para desmarcar)</label>
            <input
              type="text"
              className="form-control"
              value={referencia1}
              onChange={(e) => setReferencia1(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Actualizando...' : 'Actualizar'}
          </button>
        </form>

        {status && <div className="mt-3 alert alert-info">{status}</div>}

        {referencia1 ? (
          <div className="mt-2 alert alert-success">
            ✅ Este documento está marcado como domicilio.
          </div>
        ) : (
          <div className="mt-2 alert alert-warning">
            ⚠️ Este documento NO está marcado como domicilio.
          </div>
        )}
      </div>
    </div>
  );
};

export default MarcarDomicilio;