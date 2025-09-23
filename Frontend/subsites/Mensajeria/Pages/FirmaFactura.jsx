import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../src/context/AuthContext';
import Navbar from '../components/navbar';
import SignatureCanvas from '../components/SignatureCanvas';
import axios from '../../../src/api/axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const FirmarFactura = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const factura = location.state?.factura;
  const [signatureData, setSignatureData] = useState(null);
  const [estadoPago, setEstadoPago] = useState('pendiente');
  const [montoPagado, setMontoPagado] = useState('');
  const [observaciones, setObservaciones] = useState('');
  const [mostrarFormularioPago, setMostrarFormularioPago] = useState(false);

  const handleSignatureSave = async () => {
    if (!signatureData) {
      alert('Debe dibujar su firma antes de continuar.');
      return;
    }
    
    let signatureBase64 = signatureData;
    if (signatureBase64?.startsWith('data:image/png;base64,')) {
      signatureBase64 = signatureBase64.replace('data:image/png;base64,', '');
    }
    
    try {
      const signResponse = await axios.post('/api/document/sign', {
        documento: factura.documento,
        transaccion: factura.transaccion,
        user_id: user.id,
        signature: signatureData,
      });
  
      await axios.post('/api/actualizar-estado-entregado', {
        documento: factura.documento,
        transaccion: factura.transaccion,
        user_id: user.id,
        signature: signatureData,
      });

      // Mostrar formulario de pago después de la entrega
      setMostrarFormularioPago(true);
  
      // Abre el PDF en una nueva ventana
      if (signResponse.data.pdf_path) {
        window.open(`/api/descargar-factura/${factura.transaccion}-${factura.documento}.pdf`, '_blank');
      }
  
    } catch (error) {
      if (error.response) {
        alert('Error: ' + (error.response.data.message || error.response.statusText));
        console.log(error.response.data);
      } else {
        alert('Error: ' + error.message);
        console.log(error);
      }
    }
  };

  const handleReportePago = async () => {
    if (estadoPago === 'pagado' && !montoPagado) {
      alert('Debe especificar el monto pagado');
      return;
    }

    try {
      await axios.post('/api/reportar-pago-factura', {
        documento: factura.documento,
        transaccion: factura.transaccion,
        mensajero_id: user.id,
        estado_pago: estadoPago,
        monto_pagado: estadoPago === 'pagado' ? parseFloat(montoPagado) : null,
        observaciones: observaciones
      });

      alert('Estado de pago reportado correctamente.');
      navigate('/Mensajeria');
    } catch (error) {
      if (error.response) {
        alert('Error: ' + (error.response.data.message || error.response.statusText));
        console.log(error.response.data);
      } else {
        alert('Error: ' + error.message);
        console.log(error);
      }
    }
  };

  if (mostrarFormularioPago) {
    return (
      <div className="firma-factura-container">
        <div className="firma-fixed-box">
          <h3 className="mb-3 text-center text-primary">📄 Reporte de Pago</h3>
          <p className="text-center text-muted mb-4">
            Factura {factura.documento} - Transacción {factura.transaccion}
          </p>
          
          <div className="card">
            <div className="card-body">
              <div className="mb-3">
                <label className="form-label fw-bold">Estado de Pago:</label>
                <select 
                  className="form-select"
                  value={estadoPago}
                  onChange={(e) => setEstadoPago(e.target.value)}
                >
                  <option value="pendiente">Pendiente de Pago</option>
                  <option value="pagado">Pagado</option>
                  <option value="no_pagado">No Pagado</option>
                </select>
              </div>

              {estadoPago === 'pagado' && (
                <div className="mb-3">
                  <label className="form-label fw-bold">Monto Pagado:</label>
                  <div className="input-group">
                    <span className="input-group-text">$</span>
                    <input
                      type="number"
                      className="form-control"
                      value={montoPagado}
                      onChange={(e) => setMontoPagado(e.target.value)}
                      placeholder="0.00"
                      step="0.01"
                      min="0"
                    />
                  </div>
                </div>
              )}

              <div className="mb-3">
                <label className="form-label fw-bold">Observaciones:</label>
                <textarea
                  className="form-control"
                  rows="3"
                  value={observaciones}
                  onChange={(e) => setObservaciones(e.target.value)}
                  placeholder="Ingrese observaciones adicionales (opcional)"
                />
              </div>

              <div className="d-grid gap-2">
                <button 
                  className="btn btn-primary"
                  onClick={handleReportePago}
                >
                  💰 Reportar Estado de Pago
                </button>
                <button 
                  className="btn btn-secondary"
                  onClick={() => navigate('/Mensajeria')}
                >
                  ⏩ Saltar (Reportar después)
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="firma-factura-container">
      <div className="firma-fixed-box">
        <h3 className="mb-3 text-center">✍️ Firma para entrega</h3>
        <p className="text-center text-muted mb-4">
          Factura {factura.documento} - Transacción {factura.transaccion}
        </p>
        <SignatureCanvas onChange={setSignatureData} />
        <button className="btn btn-success mt-3 w-100" onClick={handleSignatureSave}>
          📝 Guardar Firma y Continuar
        </button>
      </div>
    </div>
  );
};

export default FirmarFactura;