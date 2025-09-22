import React, { useEffect, useState } from 'react';
import axios from '../../../src/api/axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const ReasignarFactura = () => {
    const [facturas, setFacturas] = useState([]);
    const [usuarios, setUsuarios] = useState([]);
    const [facturaId, setFacturaId] = useState('');
    const [usuarioId, setUsuarioId] = useState('');
    const [mensaje, setMensaje] = useState('');

    useEffect(() => {
        axios.get('/api/facturas/pendientes')
            .then(res => setFacturas(res.data))
            .catch(() => setMensaje('Error al cargar facturas pendientes'));

        axios.get('/api/usuarios/activos')
            .then(res => setUsuarios(res.data))
            .catch(() => setMensaje('Error al cargar usuarios activos'));
    }, []);

    const handleReasignar = async () => {
        setMensaje('');
        if (!facturaId || !usuarioId) {
            setMensaje('Seleccione una factura y un usuario.');
            return;
        }
        try {
            const res = await axios.post('/api/facturas/reasignar', {
                factura_id: facturaId,
                user_id: usuarioId,
            });
            setMensaje(res.data.message || 'Factura reasignada correctamente.');
            setFacturaId('');
            setUsuarioId('');
        } catch (error) {
            setMensaje('Error al reasignar la factura.');
        }
    };

    // Buscar la factura seleccionada para mostrar el usuario actual
    const facturaSeleccionada = facturas.find(f => f.id === parseInt(facturaId));
    const usuarioActual = facturaSeleccionada ? (facturaSeleccionada.usuario_actual || facturaSeleccionada.user_name || 'No asignado') : '';

    return (
        <div className="container mt-4">
            <h2 className="fw-bold text-primary mb-4">
                <i className="bi bi-arrow-repeat"></i>📋 Reasignar Factura
            </h2>
            {mensaje && (
                <div className={`alert ${mensaje.includes('Error') ? 'alert-danger' : 'alert-success'}`}>
                    {mensaje}
                </div>
            )}

            <div className="row mb-3">
                <div className="col-md-6">
                    <label className="form-label fw-semibold text-primary">Factura pendiente:</label>
                    <select
                        className="form-select border-primary"
                        value={facturaId}
                        onChange={e => setFacturaId(e.target.value)}
                    >
                        <option value="">-- Seleccione --</option>
                        {facturas.map(f => (
                            <option key={f.id} value={f.id}>
                                {f.documento} - {f.transaccion} - {f.usuario_actual || f.user_name || 'No asignado'}
                            </option>
                        ))}
                    </select>
                    {facturaId && (
                        <div className="mt-2">
                            <span className="badge bg-info text-dark">
                                Asignado a: {usuarioActual}
                            </span>
                        </div>
                    )}
                </div>
                <div className="col-md-6">
                    <label className="form-label fw-semibold text-primary">Reasignar a:</label>
                    <select
                        className="form-select border-success"
                        value={usuarioId}
                        onChange={e => setUsuarioId(e.target.value)}
                    >
                        <option value="">-- Seleccione --</option>
                        {usuarios.map(u => (
                            <option key={u.id} value={u.id} className="text-success">
                                {u.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <button
                className="btn btn-lg btn-primary px-4"
                onClick={handleReasignar}
                style={{ fontWeight: 'bold', letterSpacing: 1 }}
            >
                <i className="bi bi-arrow-right-circle"></i> Reasignar Factura
            </button>
        </div>
    );
};

export default ReasignarFactura;