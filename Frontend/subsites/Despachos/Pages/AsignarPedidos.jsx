import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/navbar';
import axios from '../../../src/api/axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../assets/AsignarPedidos.css'; 

const AsignarPedidos = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const factura = location.state?.factura;
  const [usuarios, setUsuarios] = useState([]);
  const [selectedMensajero, setSelectedMensajero] = useState('');

  useEffect(() => {
    axios.get('/api/usuarios-mensajeria').then(res => setUsuarios(res.data));
  }, []);

  const handleAsignar = async () => {
    if (!selectedMensajero) {
      alert('Seleccione un mensajero');
      return;
    }
    await axios.post('/api/asignar-mensajero', {
      factura_id: factura.factura_id,
      transaccion: factura.transaccion,
      user_id: selectedMensajero,
    });
    alert('Mensajero asignado correctamente');
    navigate('/Despachos');
  };

  return (
    <div className="AsignarPedidos-container">
      <Navbar />
      <div className="AsignarPedidos-main container mt-5">
        <div className="card border-0">
          <div className="card-body">
            <h3 className="text-center mb-4">
              🚚 Asignar Mensajero a Factura {factura?.factura_id}
            </h3>

            <div className="mb-3">
              <label className="form-label fw-bold">Seleccione un mensajero:</label>
              <select
                className="form-select"
                value={selectedMensajero}
                onChange={e => setSelectedMensajero(e.target.value)}
              >
                <option value="">Seleccione un mensajero</option>
                {usuarios.map(u => (
                  <option key={u.id} value={u.id}>
                    {u.name}
                  </option>
                ))}
              </select>
            </div>

            <button className="btn btn-success w-100" onClick={handleAsignar}>
              ✅ Asignar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AsignarPedidos;