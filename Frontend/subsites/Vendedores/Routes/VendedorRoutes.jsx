import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Vendedor from '../Pages/Vendedor';
import GestionarFactura from '../Pages/GestionarFactura';
import Historial from '../Pages/Historial';
import MarcarDomicilio from '../Pages/MarcarDomicilio';
import SignatureCanvas from '../components/SignatureCanvas';
import DescargarFactura from '../Pages/DescargarFactura';
import FirmaFactura from '../Pages/FirmaFactura';
import Notas from '../Pages/Notas';

const VendedorRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Vendedor />} />
      <Route path="/gestionar-factura" element={<GestionarFactura />} />
      <Route path="/historial" element={<Historial />} />
      <Route path="/marcar-domicilio" element={<MarcarDomicilio />} />
      <Route path="/signature-canvas" element={<SignatureCanvas />} />
      <Route path="/descargar-factura" element={<DescargarFactura />} />
      <Route path="/firma" element={<FirmaFactura />} />
      <Route path="/notas" element={<Notas />} />
    </Routes>
  );
};

export default VendedorRoutes;