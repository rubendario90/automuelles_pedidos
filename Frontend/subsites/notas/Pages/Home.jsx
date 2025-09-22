import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from '../../../src/api/axios';
import { useAuth } from '../../../src/context/AuthContext';
import '../assets/Home.css';

const Home = () => {
  const [notas, setNotas] = useState([]);
  const [tercerosInfo, setTercerosInfo] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [notaSeleccionada, setNotaSeleccionada] = useState(null);
  const { user } = useAuth();

  const fetchNotas = async () => {
    const res = await axios.get('/api/notas-autorizadas');
    setNotas(res.data);

    const ids = [...new Set(res.data.map(nota => {
      const data = typeof nota.data === 'string' ? JSON.parse(nota.data) : nota.data;
      return data.tercero;
    }).filter(id => id))];

    const terceroResults = await Promise.all(
      ids.map(id =>
        axios.get('/api/terceros/buscar', { params: { query: id } })
      )
    );

    const info = {};
    ids.forEach((id, idx) => {
      if (terceroResults[idx].data.length > 0) {
        info[id] = terceroResults[idx].data[0];
      }
    });
    setTercerosInfo(info);
  };

  useEffect(() => {
    fetchNotas();
    const interval = setInterval(fetchNotas, 60000); // 1 minuto
    return () => clearInterval(interval);
  }, []);

  const handleOpenModal = (nota) => {
    setNotaSeleccionada(nota);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setNotaSeleccionada(null);
  };

  const handleGuardarNota = async () => {
    await axios.put(`/api/notas/${notaSeleccionada.id}/crear`, { usuario: user?.name });
    alert('Nota Creada');
    setShowModal(false);
    setNotaSeleccionada(null);
    await fetchNotas();
  };

  return (
    <div className="container py-4 notas-modal">
      <h2 className="mb-4 fw-bold text-primary">Área Administrativa de Notas</h2>
      {/* Buscador */}
      <div className="input-group mb-4 shadow-sm">
        <input
          type="text"
          className="form-control"
          placeholder="¿Qué deseas buscar?.."
          aria-label="Buscar"
        />
        <button className="btn btn-primary" type="button">Buscar</button>
      </div>
      {notas.length === 0 ? (
        <div className="alert alert-info text-center">
          No hay notas pendientes
        </div>
      ) : (
        <div className="row justify-content-center">
          {notas.map(nota => {
            const data = typeof nota.data === 'string' ? JSON.parse(nota.data) : nota.data;
            const tercero = tercerosInfo[data.tercero];
            return (
              <div key={nota.id} className="col-md-4 mb-4">
                <div className="card custom-card shadow-sm border-0 text-center p-3">
                  <div className="card-body-notas">
                    <h3 className="card-title name-title mb-2">
                      {tercero ? tercero.StrNombre : 'Nombre Desconocido'}
                    </h3>
                    <p className="card-subtitle text-muted mb-3">{data.tercero}</p>

                    <p><strong>Transacción:</strong> {data.transaccion}</p>
                    <p><strong>Documento:</strong> {data.documento}</p>
                    <p>
                      <strong>Producto(s) a cancelar:</strong>
                      <ul style={{ listStyle: 'none', paddingLeft: 0, marginBottom: 0 }}>
                        {Array.isArray(data.producto) ? data.producto.map(prod => (
                          <li key={prod} style={{ display: 'flex', alignItems: 'center', gap: '0.5em' }}>
                            <span>{prod}</span>
                            {data.cantidadesCancelar && data.cantidadesCancelar[prod] !== undefined && (
                              <span className="badge cantidad-badge-Notas">Cantidad: {data.cantidadesCancelar[prod]}</span>
                            )}
                          </li>
                        )) : (
                          <li style={{ display: 'flex', alignItems: 'center', gap: '0.5em' }}>
                            <span>{data.producto}</span>
                            {data.cantidadesCancelar && data.cantidadesCancelar[data.producto] !== undefined && (
                              <span className="badge cantidad-badge-Notas">Cantidad: {data.cantidadesCancelar[data.producto]}</span>
                            )}
                          </li>
                        )}
                      </ul>
                    </p>
                    <p><strong>Motivo:</strong> {data.motivo}</p>
                    <p><strong>Usuario:</strong> {data.usuario}</p>
                    <p><strong>Autorizado por:</strong> {data.autorizado}</p>
                    <p><strong>Fecha:</strong> {nota.created_at}</p>

                    <button
                      className="btn btn-contact mt-3"
                      onClick={() => handleOpenModal(nota)}
                    >
                      Guardar
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal */}
      {showModal && notaSeleccionada && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0,0,0,0.5)',
            zIndex: 1050,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'auto'
          }}
        >
          <div className="modal-dialog modal-dialog-centered" style={{ pointerEvents: 'auto' }}>
            <div className="card shadow-lg border-0">
              <div className="card-header d-flex justify-content-between align-items-center bg-primary text-white">
                <h5 className="mb-0">Confirmar Guardado de Nota</h5>
                <button type="button" className="btn-close btn-close-white" aria-label="Close" onClick={handleCloseModal}></button>
              </div>
              <div className="card-body-notas">
                <div className="mb-3">
                  <strong>Numero de Documento:</strong> {notaSeleccionada.data?.tercero || JSON.parse(notaSeleccionada.data).tercero}
                </div>
                {/* Datos del tercero */}
                {(() => {
                  const data = typeof notaSeleccionada.data === 'string'
                    ? JSON.parse(notaSeleccionada.data)
                    : notaSeleccionada.data;
                  const tercero = tercerosInfo[data.tercero];
                  return tercero ? (
                    <div className="bg-light p-2 rounded mb-3">
                      <p><strong>Nombre:</strong> {tercero.StrNombre}</p>
                      <p><strong>Tipo ID:</strong> {tercero.StrTipoId}</p>
                      <p><strong>Apellido1:</strong> {tercero.StrApellido1}</p>
                      <p><strong>Apellido2:</strong> {tercero.StrApellido2}</p>
                      <p><strong>Nombre1:</strong> {tercero.StrNombre1}</p>
                      <p><strong>Nombre2:</strong> {tercero.StrNombre2}</p>
                    </div>
                  ) : null;
                })()}
                <div className="mb-3">
                  <strong>Transacción:</strong> {notaSeleccionada.data?.transaccion || JSON.parse(notaSeleccionada.data).transaccion}
                </div>
                <div className="mb-3">
                  <strong>Documento:</strong> {notaSeleccionada.data?.documento || JSON.parse(notaSeleccionada.data).documento}
                </div>
                <div className="mb-3">
                  <strong>Producto(s) a cancelar:</strong>
                  <ul style={{ listStyle: 'none', paddingLeft: 0, marginBottom: 0 }}>
                    {Array.isArray(notaSeleccionada.data?.producto || JSON.parse(notaSeleccionada.data).producto)
                      ? (notaSeleccionada.data?.producto || JSON.parse(notaSeleccionada.data).producto).map(prod => (
                        <li key={prod} style={{ display: 'flex', alignItems: 'center', gap: '0.5em' }}>
                          <span>{prod}</span>
                          {(notaSeleccionada.data?.cantidadesCancelar || JSON.parse(notaSeleccionada.data).cantidadesCancelar)?.[prod] !== undefined && (
                            <span className="badge cantidad-badge-Notas">
                              Cantidad: {(notaSeleccionada.data?.cantidadesCancelar || JSON.parse(notaSeleccionada.data).cantidadesCancelar)[prod]}
                            </span>
                          )}
                        </li>
                      ))
                      : (
                        <li style={{ display: 'flex', alignItems: 'center', gap: '0.5em' }}>
                          <span>{notaSeleccionada.data?.producto || JSON.parse(notaSeleccionada.data).producto}</span>
                          {(notaSeleccionada.data?.cantidadesCancelar || JSON.parse(notaSeleccionada.data).cantidadesCancelar)?.[notaSeleccionada.data?.producto || JSON.parse(notaSeleccionada.data).producto] !== undefined && (
                            <span className="badge cantidad-badge-Notas">
                              Cantidad: {(notaSeleccionada.data?.cantidadesCancelar || JSON.parse(notaSeleccionada.data).cantidadesCancelar)[notaSeleccionada.data?.producto || JSON.parse(notaSeleccionada.data).producto]}
                            </span>
                          )}
                        </li>
                      )
                    }
                  </ul>
                </div>
                <div className="mb-3">
                  <strong>Motivo:</strong> {notaSeleccionada.data?.motivo || JSON.parse(notaSeleccionada.data).motivo}
                </div>
                <div className="mb-3">
                  <strong>Usuario:</strong> {notaSeleccionada.data?.usuario || JSON.parse(notaSeleccionada.data).usuario}
                </div>
                <div className="mb-3">
                  <strong>Autorizado por:</strong> {notaSeleccionada.data?.autorizado || JSON.parse(notaSeleccionada.data).autorizado}
                </div>
                <div className="mb-3">
                  <strong>Fecha:</strong> {notaSeleccionada.created_at}
                </div>
              </div>
              <div className="card-footer d-flex justify-content-end gap-2">
                <button className="btn btn-secondary" type="button" onClick={handleCloseModal}>Cancelar</button>
                <button className="btn btn-primary" onClick={handleGuardarNota}>Guardar</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
