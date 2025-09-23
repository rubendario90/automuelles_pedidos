import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Facturacion from '../Pages/Facturacion';

const FacturacionRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Facturacion />} />
    </Routes>
  );
};

export default FacturacionRoutes;