import React, { useState, useEffect } from 'react';
import axios from '../../../src/api/axios';

const CambioRol = ({ showModal, handleCloseModal }) => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (showModal) {
      axios.get('/api/usuarios').then(res => setUsers(res.data));
      axios.get('/api/roles').then(res => setRoles(res.data));
    }
  }, [showModal]);

  useEffect(() => {
    if (selectedUser) {
      const user = users.find(u => u.id === parseInt(selectedUser));
      setSelectedRole(user ? user.role_id : '');
    }
  }, [selectedUser, users]);

  const handleChangeRole = async (e) => {
    e.preventDefault();
    setProcessing(true);
    try {
      await axios.put('/api/cambio-rol', {
        user_id: selectedUser,
        role_id: selectedRole,
      });
      alert('Rol actualizado correctamente.');
      handleCloseModal();
      setSelectedUser('');
      setSelectedRole('');
    } catch {
      alert('Error al actualizar el rol.');
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
            <h5 className="modal-title">Cambiar Rol de Usuario</h5>
            <button type="button" className="btn-close" onClick={handleCloseModal}></button>
          </div>
          <div className="modal-body">
            <form onSubmit={handleChangeRole}>
              <div className="mb-3">
                <label className="form-label">Usuario</label>
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
              <div className="mb-3">
                <label className="form-label">Rol</label>
                <select
                  className="form-select"
                  value={selectedRole}
                  onChange={e => setSelectedRole(e.target.value)}
                  required
                  disabled={!selectedUser}
                >
                  <option value="">-- Seleccione --</option>
                  {roles.map(r => (
                    <option key={r.id} value={r.id}>{r.name}</option>
                  ))}
                </select>
              </div>
              <div className="d-flex justify-content-end">
                <button type="button" className="btn btn-secondary me-2" onClick={handleCloseModal}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary" disabled={processing || !selectedUser || !selectedRole}>
                  {processing ? 'Actualizando...' : 'Actualizar Rol'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CambioRol;