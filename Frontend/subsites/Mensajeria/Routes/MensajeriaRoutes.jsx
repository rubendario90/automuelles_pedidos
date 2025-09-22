import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Mensajeria from '../Pages/Mensajeria';
import GestionarFactura from '../Pages/GestionarFactura';
import Historial from '../Pages/Historial';
import FormularioMensajeria from '../Pages/FormularioMensajeria';
import SignatureCanvas from '../components/SignatureCanvas';
import DescargarFactura from '../Pages/DescargarFactura';
import FirmaFactura from '../Pages/FirmaFactura';

const VendedorRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Mensajeria />} />
      <Route path="/gestionar-factura" element={<GestionarFactura />} />
      <Route path="/historial" element={<Historial />} />
      <Route path="/FormularioMensajeria" element={<FormularioMensajeria />} />
      <Route path="/signature-canvas" element={<SignatureCanvas />} />
      <Route path="/descargar-factura" element={<DescargarFactura />} />
      <Route path="/firma" element={<FirmaFactura />} />
    </Routes>
  );
};

export default VendedorRoutes;