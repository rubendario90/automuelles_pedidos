import React, { useEffect, useState } from 'react';
import axios from '../../../src/api/axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const Historial = () => {
  const [notas, setNotas] = useState([]);
  const [transaccion, setTransaccion] = useState('');
  const [documento, setDocumento] = useState('');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');

  const fetchHistorial = async (params = {}) => {
    const res = await axios.get('/api/notas-historial', { params });
    setNotas(res.data);
  };

  useEffect(() => {
    fetchHistorial();
  }, []);

  const handleBuscar = (e) => {
    e.preventDefault();
    fetchHistorial({
      transaccion: transaccion || undefined,
      documento: documento || undefined,
      fecha_inicio: fechaInicio || undefined,
      fecha_fin: fechaFin || undefined,
    });
  };

  return (
    <div className="container py-4">
      <h2 className="mb-4 fw-bold text-primary">Historial de Notas</h2>
      <form className="row g-3 mb-4" onSubmit={handleBuscar}>
        <div className="col-md-3">
          <input
            type="text"
            className="form-control"
            placeholder="Transacción"
            value={transaccion}
            onChange={e => setTransaccion(e.target.value)}
          />
        </div>
        <div className="col-md-3">
          <input
            type="text"
            className="form-control"
            placeholder="Documento"
            value={documento}
            onChange={e => setDocumento(e.target.value)}
          />
        </div>
        <div className="col-md-3">
          <input
            type="date"
            className="form-control"
            placeholder="Fecha inicio"
            value={fechaInicio}
            onChange={e => setFechaInicio(e.target.value)}
          />
        </div>
        <div className="col-md-3">
          <input
            type="date"
            className="form-control"
            placeholder="Fecha fin"
            value={fechaFin}
            onChange={e => setFechaFin(e.target.value)}
          />
        </div>
        <div className="col-12">
          <button className="btn btn-primary w-100" type="submit">Buscar</button>
        </div>
      </form>
      {notas.length === 0 ? (
        <div className="alert alert-info text-center">
          No hay historial de notas.
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered table-hover align-middle">
            <thead className="table-primary">
              <tr>
                <th>ID</th>
                <th>Documento</th>
                <th>Transacción</th>
                <th>Producto</th>
                <th>Motivo</th>
                <th>Usuario</th>
                <th>Autorizado</th>
                <th>Creado</th>
                <th>Fecha</th>
              </tr>
            </thead>
            <tbody>
              {notas.map(nota => {
                const data = typeof nota.data === 'string' ? JSON.parse(nota.data) : nota.data;
                return (
                  <tr key={nota.id}>
                    <td>{nota.id}</td>
                    <td>{data.documento}</td>
                    <td>{data.transaccion}</td>
                    <td>{Array.isArray(data.producto) ? data.producto.join(', ') : data.producto}</td>
                    <td>{data.motivo}</td>
                    <td>{data.usuario}</td>
                    <td>{data.autorizado}</td>
                    <td>{data.creado}</td>
                    <td>{nota.created_at}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Historial;