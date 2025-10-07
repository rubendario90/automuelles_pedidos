import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Garantias from '../Pages/Garantias';
import GestionarGarantia from '../Pages/GestionarGarantia';
import Historial from '../Pages/Historial';

const GarantiasRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Garantias />} />
      <Route path="/gestionar-garantia" element={<GestionarGarantia />} />
      <Route path="/historial" element={<Historial />} />
    </Routes>
  );
};

export default GarantiasRoutes;
