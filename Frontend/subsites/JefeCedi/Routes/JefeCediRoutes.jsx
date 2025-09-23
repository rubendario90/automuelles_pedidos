import React from 'react';
import { Routes, Route } from 'react-router-dom'; // Use Routes instead of Switch
import JefeCedi from '../Pages/JefeCedi';
import GestionarFactura from '../Pages/GestionarFactura';
import RevisionFinal from '../Pages/RevisionFinal';
import Historial from '../Pages/Historial';
import PedidosParciales from '../Pages/PedidosParciales';
import Notas from '../Pages/Notas';

const JefeCediRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<JefeCedi />} /> 
      <Route path="/gestionar-factura" element={<GestionarFactura />} /> 
      <Route path="/revision-final" element={<RevisionFinal />} /> 
      <Route path="/historial" element={<Historial />} />
      <Route path="/pedidos-parciales" element={<PedidosParciales />} />
      <Route path="/notas" element={<Notas />} />

    </Routes>
  );
};

export default JefeCediRoutes;