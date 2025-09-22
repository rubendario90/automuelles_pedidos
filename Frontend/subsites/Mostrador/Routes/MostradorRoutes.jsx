import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Mostrador from '../Pages/Mostrador';
import GestionarFactura from '../Pages/GestionarFactura';
import Historial from '../Pages/Historial';
import MarcarDomicilio from '../Pages/MarcarDomicilio';
import SignatureCanvas from '../components/SignatureCanvas';
import DescargarFactura from '../Pages/DescargarFactura';
import FirmaFactura from '../Pages/FirmaFactura';

const MostradorRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Mostrador />} />
      <Route path="/gestionar-factura" element={<GestionarFactura />} />
      <Route path="/historial" element={<Historial />} />
      <Route path="/marcar-domicilio" element={<MarcarDomicilio />} />
      <Route path="/signature-canvas" element={<SignatureCanvas />} />
      <Route path="/descargar-factura" element={<DescargarFactura />} />
      <Route path="/firma" element={<FirmaFactura />} />
    </Routes>
  );
};

export default MostradorRoutes;