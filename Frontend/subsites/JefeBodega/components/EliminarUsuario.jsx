import React, { useState, useEffect } from 'react';
import axios from '../../../src/api/axios';

const EliminarUsuario = ({ showModal, handleCloseModal }) => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (showModal) {
      axios.get('/api/usuarios')
        .then(res => setUsers(res.data))
        .catch(() => setUsers([]));
    }
  }, [showModal]);

  const handleEliminar = async () => {
    if (!selectedUser) return;
    setProcessing(true);
    try {
      await axios.delete(`/api/usuarios/${selectedUser}`);
      alert('Usuario eliminado correctamente.');
      handleCloseModal();
      setSelectedUser('');
    } catch (error) {
      alert('Error al eliminar el usuario.');
    } finally {
      setProcessing(false);
    }
  };

  if (!showModal) return null;

  return (
    <div className="modal show d-block" tabIndex="-1" role="dialog">
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Eliminar Usuario</h5>
            <button type="button" className="btn-close" onClick={handleCloseModal}></button>
          </div>
          <div className="modal-body">
            <div className="mb-3">
              <label className="form-label">Seleccione el usuario a eliminar</label>
              <select
                className="form-select"
                value={selectedUser}
                onChange={e => setSelectedUser(e.target.value)}
                required
              >
                <option value="">-- Seleccione --</option>
                {users.map(u => (
                  <option key={u.id} value={u.id}>{u.name} ({u.email})</option>
                ))}
              </select>
            </div>
            <p>¿Está seguro que desea eliminar este usuario?</p>
            <div className="d-flex justify-content-end">
              <button
                type="button"
                className="btn btn-secondary me-2"
                onClick={handleCloseModal}
                disabled={processing}
              >
                Cancelar
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={handleEliminar}
                disabled={!selectedUser || processing}
              >
                {processing ? 'Eliminando...' : 'Eliminar'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EliminarUsuario;