import React from 'react';
import { Routes, Route } from 'react-router-dom'; // Use Routes instead of Switch
import Despachos from '../Pages/Despachos';
import GestionarFactura from '../Pages/GestionarFactura';
import ReasignarPedidos from '../Pages/ReasignarPedidos';
import Historial from '../Pages/Historial';
import GestionarFacturaDespachos from '../Pages/GestionarFacturaDespachos';
import AsignarPedidos from '../Pages/AsignarPedidos';
import MarcarDomicilio from '../Pages/MarcarDomicilio';
import PedidosDespachos from '../Pages/PedidosDespachos';
import RastreoPedidos from '../Pages/RastreoPedidos';
import VerPedidos from '../Pages/VerPedidos';

const DespachosRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Despachos />} /> 
      <Route path="/gestionar-factura" element={<GestionarFactura />} />
      <Route path="/Reasignar-pedidos" element={<ReasignarPedidos />} /> 
      <Route path="/historial" element={<Historial />} />
      <Route path="/gestionar-factura-despachos" element={<GestionarFacturaDespachos />} />
      <Route path="/asignar-pedidos" element={<AsignarPedidos />} />
      <Route path="/marcar-domicilio" element={<MarcarDomicilio />} />
      <Route path="/pedidos-despachos" element={<PedidosDespachos />} />
      <Route path="/rastreo-pedidos" element={<RastreoPedidos />} />
      <Route path="/ver-pedido" element={<VerPedidos />} />
    </Routes>
  );
};

export default DespachosRoutes;