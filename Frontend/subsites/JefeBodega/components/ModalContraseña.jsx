import React, { useState, useEffect } from 'react';
import axios from '../../../src/api/axios';

const getCsrfToken = async () => {
    await axios.get('/sanctum/csrf-cookie');
};

const ModalContraseña = ({ showModal, handleCloseModal }) => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [passwordData, setPasswordData] = useState({
    password: '',
    password_confirmation: '',
  });
  const [errors, setErrors] = useState({});
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (showModal) {
      axios.get('/api/usuarios')
        .then(res => setUsers(res.data))
        .catch(() => setUsers([]));
    }
  }, [showModal]);

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);
    setErrors({});
    try {
      await getCsrfToken();
      await axios.put('/api/user/force-password', {
        user_id: selectedUser,
        password: passwordData.password,
        password_confirmation: passwordData.password_confirmation,
      });
      alert('Contraseña actualizada correctamente.');
      handleCloseModal();
      setPasswordData({
        password: '',
        password_confirmation: '',
      });
      setSelectedUser('');
    } catch (error) {
      if (error.response?.status === 422) {
        setErrors(error.response.data.errors);
      } else {
        alert('Error al actualizar la contraseña.');
      }
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
            <h5 className="modal-title">Cambiar Contraseña de Usuario</h5>
            <button type="button" className="btn-close" onClick={handleCloseModal}></button>
          </div>
          <div className="modal-body">
            <form onSubmit={handlePasswordSubmit}>
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
                {errors.user_id && (
                  <div className="text-danger">{errors.user_id[0]}</div>
                )}
              </div>
              <div className="mb-3">
                <label className="form-label">Nueva Contraseña</label>
                <input
                  type="password"
                  className="form-control"
                  value={passwordData.password}
                  onChange={e => setPasswordData({ ...passwordData, password: e.target.value })}
                  required
                />
                {errors.password && (
                  <div className="text-danger">{errors.password[0]}</div>
                )}
              </div>
              <div className="mb-3">
                <label className="form-label">Confirmar Nueva Contraseña</label>
                <input
                  type="password"
                  className="form-control"
                  value={passwordData.password_confirmation}
                  onChange={e => setPasswordData({ ...passwordData, password_confirmation: e.target.value })}
                  required
                />
              </div>
              <div className="d-flex justify-content-end">
                <button type="button" className="btn btn-secondary me-2" onClick={handleCloseModal}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary" disabled={processing}>
                  {processing ? 'Procesando...' : 'Actualizar Contraseña'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalContraseña;