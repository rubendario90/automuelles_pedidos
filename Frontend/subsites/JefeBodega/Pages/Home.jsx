import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import FacturasGrafica from '../components/GraficasFacturas';
import ModalContraseña from '../components/ModalContraseña';
import EliminarUsuario from '../components/EliminarUsuario';
import ModalCambioRol from '../components/ModalCambioRol'; // Solo una vez

const Home = () => {
  const [showModalContraseña, setShowModalContraseña] = useState(false);
  const [showModalEliminar, setShowModalEliminar] = useState(false);
  const [showModalRol, setShowModalRol] = useState(false); // Nuevo estado

  const handleOpenModalContraseña = () => setShowModalContraseña(true);
  const handleCloseModalContraseña = () => setShowModalContraseña(false);

  const handleOpenModalEliminar = () => setShowModalEliminar(true);
  const handleCloseModalEliminar = () => setShowModalEliminar(false);

  const handleOpenModalRol = () => setShowModalRol(true); // Corregido
  const handleCloseModalRol = () => setShowModalRol(false); // Corregido

  return (
    <div className="container py-4">
      <h2 className="mb-4 fw-bold text-primary">Área Administrativa de Bodega</h2>

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

      {/* Sección destacada */}
      <div className="mb-4">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <h5 className="mb-0">Destacados</h5>
        </div>

        <div className="row g-3">
          <div className="col-md-6 col-lg-4">
            <FacturasGrafica />
          </div>
        </div>
      </div>

      {/* Categorías */}
      <div className="mb-4">
        <h5 className="mb-3">Categorías</h5>
        <div className="d-flex flex-wrap gap-3">
          <button
            className="btn btn-outline-primary rounded-pill px-3 py-2"
            onClick={handleOpenModalContraseña}
          >
            Cambiar Contraseña
          </button>
          <button
            className="btn btn-outline-primary rounded-pill px-3 py-2"
            onClick={handleOpenModalEliminar}
          >
            Eliminar Usuario
          </button>
          <button
            className="btn btn-outline-primary rounded-pill px-3 py-2"
            onClick={handleOpenModalRol}
          >
            Cambiar Rol
          </button>
        </div>
      </div>

      {/* Más populares */}
      <div>
        <div className="d-flex justify-content-between align-items-center mb-2">
          <h5 className="mb-0">Bodega</h5>
        </div>

        <div className="row g-3">
          <div className="col-md-6 col-lg-4">
            <div className="card shadow-sm border-0 h-100" style={{ background: '#e3f2fd' }}>
              <div className="card-body">
                <h6 className="fw-bold">Maratón</h6>
                <p className="mb-1 text-muted">2.418 inscritos</p>
                <span className="badge bg-primary">$48</span>
              </div>
            </div>
          </div>

          <div className="col-md-6 col-lg-4">
            <div className="card shadow-sm border-0 h-100" style={{ background: '#fde0dc' }}>
              <div className="card-body">
                <h6 className="fw-bold">Running Natural</h6>
                <p className="mb-1 text-muted">1.264 inscritos</p>
                <span className="badge bg-danger">$35</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modales */}
      <ModalContraseña showModal={showModalContraseña} handleCloseModal={handleCloseModalContraseña} />
      <EliminarUsuario showModal={showModalEliminar} handleCloseModal={handleCloseModalEliminar} />
      <ModalCambioRol showModal={showModalRol} handleCloseModal={handleCloseModalRol} />
    </div>
  );
};

export default Home;