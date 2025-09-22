import React, { useEffect, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer
} from 'recharts';
import axios from '../../../src/api/axios';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

const FacturasGrafica = () => {
  const [dataPorHora, setDataPorHora] = useState([]);

  useEffect(() => {
    const fetchFacturas = async () => {
      try {
        const response = await axios.get('/api/facturas', { withCredentials: true });
        const facturas = response.data;

        const conteoPorHora = {};

        facturas.forEach(factura => {
          // Convertir la fecha UTC a la zona horaria de Bogotá y aumentar 5 horas
          const hora = dayjs(factura.created_at)
            .utc()
            .tz('America/Bogota')
            .format('HH:00');
          conteoPorHora[hora] = (conteoPorHora[hora] || 0) + 1;
        });

        const dataFormateada = Object.keys(conteoPorHora)
          .sort()
          .map(hora => ({
            hora,
            cantidad: conteoPorHora[hora]
          }));

        setDataPorHora(dataFormateada);
      } catch (error) {
        console.error('Error al obtener las facturas:', error);
      }
    };

    fetchFacturas();
  }, []);

  return (
    <div className="card shadow-sm border-0 h-100" style={{ background: '#f8f9fa' }}>
      <div className="card-body">
        <h5 className="fw-bold text-primary text-center">📈 Tendencia de Facturas por Hora</h5>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={dataPorHora}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="hora"
              label={{ value: 'Hora', position: 'insideBottom', offset: -5 }}
            />
            <YAxis
              allowDecimals={false}
              label={{ value: 'Facturas', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip formatter={(value) => `${value} facturas`} />
            <Line
              type="monotone"
              dataKey="cantidad"
              stroke="#0d6efd"
              strokeWidth={3}
              dot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default FacturasGrafica;