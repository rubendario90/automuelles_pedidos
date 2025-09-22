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
  console.log(factura);
  const [signatureData, setSignatureData] = useState(null);

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
  
      // Abre el PDF en una nueva ventana
      if (signResponse.data.pdf_path) {
        window.open(`/api/descargar-factura/${factura.transaccion}-${factura.documento}.pdf`, '_blank');
        // O usa la ruta del backend si la retorna: window.open(signResponse.data.pdf_path, '_blank');
      }
  
      alert('Firma guardada y estado actualizado.');
      navigate('/Vendedores');
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

  return (
    <div className="firma-factura-container">
      <div className="firma-fixed-box">
        <h3 className="mb-3 text-center">Firma para entrega</h3>
        <SignatureCanvas onChange={setSignatureData} />
        <button className="btn btn-success mt-3 w-100" onClick={handleSignatureSave}>
          Guardar Firma
        </button>
      </div>
    </div>
  );
};

export default FirmarFactura;