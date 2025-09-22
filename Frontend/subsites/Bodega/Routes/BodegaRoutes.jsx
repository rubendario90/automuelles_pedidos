import React from 'react';
import { Routes, Route } from 'react-router-dom'; // Use Routes instead of Switch
import Bodega from '../Pages/Bodega';
import GestionarFactura from '../Pages/GestionarFactura';
import RevisionFinal from '../Pages/RevisionFinal';
import Historial from '../Pages/Historial';
import PedidosParciales from '../Pages/PedidosParciales';

const BodegaRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Bodega />} /> 
      <Route path="/gestionar-factura" element={<GestionarFactura />} /> 
      <Route path="/revision-final" element={<RevisionFinal />} /> 
      <Route path="/historial" element={<Historial />} />
      <Route path="/pedidos-parciales" element={<PedidosParciales />} />
    </Routes>
  );
};

export default BodegaRoutes;