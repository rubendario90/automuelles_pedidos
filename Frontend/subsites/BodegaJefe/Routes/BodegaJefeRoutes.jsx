import React from 'react';
import { Routes, Route } from 'react-router-dom'; // Use Routes instead of Switch
import BodegaJefe from '../Pages/BodegaJefe';
import GestionarFactura from '../Pages/GestionarFactura';
import RevisionFinal from '../Pages/RevisionFinal';
import Historial from '../Pages/Historial';
import PedidosParciales from '../PageS/PedidosParciales';

const BodegaJefeRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<BodegaJefe />} /> 
      <Route path="/gestionar-factura" element={<GestionarFactura />} /> 
      <Route path="/revision-final" element={<RevisionFinal />} /> 
      <Route path="/historial" element={<Historial />} />
      <Route path="/pedidos-parciales" element={<PedidosParciales />} />
    </Routes>
  );
};

export default BodegaJefeRoutes;