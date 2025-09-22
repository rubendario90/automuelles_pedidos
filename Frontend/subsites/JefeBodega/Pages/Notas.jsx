import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import axios from '../../../src/api/axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../src/context/AuthContext';
import '../assets/Notas.css';

const Notas = () => {
    const [form, setForm] = useState({
        tercero: '',
        transaccion: '',
        documento: '',
        producto: [],
        motivo: ''
    });
    const [cantidadesCancelar, setCantidadesCancelar] = useState({});
    const navigate = useNavigate();
    const { user } = useAuth();
    const [mensaje, setMensaje] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [busqueda, setBusqueda] = useState('');
    const [resultados, setResultados] = useState([]);
    const [terceroSeleccionado, setTerceroSeleccionado] = useState(null);
    const [productosOpciones, setProductosOpciones] = useState([]);
    const [showPendientesModal, setShowPendientesModal] = useState(false);
    const [notasPendientes, setNotasPendientes] = useState([]);
    const [tercerosInfo, setTercerosInfo] = useState({});

    const handleChange = e => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const buscarTercero = async () => {
        const res = await axios.get('/api/terceros/buscar', { params: { query: busqueda } });
        setResultados(res.data);
    };

    const handleSubmit = async e => {
        e.preventDefault();
        try {
            await axios.post('/api/notas', {
                ...form,
                usuario: user?.name,
                cantidadesCancelar
            });
            setMensaje('Nota guardada correctamente');
            setForm({
                tercero: '',
                transaccion: '',
                documento: '',
                producto: [],
                motivo: ''
            });
            setCantidadesCancelar({});
            window.location.reload();
        } catch (err) {
            setMensaje('Error al guardar la nota');
        }
    };

    const handleTransaccionDocumentoChange = async (e) => {
        handleChange(e);
        const { name, value } = e.target;
        const newForm = { ...form, [name]: value };

        if (name === 'transaccion' || name === 'documento') {
            if (newForm.transaccion && newForm.documento) {
                const res = await axios.get('/api/productos-por-documento', {
                    params: {
                        transaccion: newForm.transaccion,
                        documento: newForm.documento
                    }
                });
                setProductosOpciones(res.data);
                setForm({ ...newForm, producto: [] });
                setCantidadesCancelar({});
            }
        }
    };

    // Función para traer las notas pendientes
    const cargarNotasPendientes = async () => {
        const res = await axios.get('/api/notas-pendientes');
        setNotasPendientes(res.data);

        // Obtén los ids únicos de terceros
        const ids = [...new Set(res.data.map(nota => {
            const data = typeof nota.data === 'string' ? JSON.parse(nota.data) : nota.data;
            return data.tercero;
        }).filter(id => id))];

        // Consulta los datos de cada tercero
        const info = {};
        for (const id of ids) {
            const terceroRes = await axios.get('/api/terceros/buscar', { params: { query: id } });
            if (terceroRes.data.length > 0) {
                info[id] = terceroRes.data[0];
            }
        }
        setTercerosInfo(info);
    };

    // Abrir modal y cargar datos
    const handleOpenPendientes = async () => {
        await cargarNotasPendientes();
        setShowPendientesModal(true);
    };

    return (
        <div>
            <div className="d-flex justify-content-end mb-3">
                <button className="btn btn-primary" onClick={handleOpenPendientes}>
                    Ver Notas Pendientes
                </button>
            </div>
            {showPendientesModal && (
                <div className="modal show d-block" tabIndex="-1">
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Notas Pendientes por Aprobar</h5>
                                <button type="button" className="btn-close" onClick={() => setShowPendientesModal(false)}></button>
                            </div>
                            <div className="modal-body notas-modal">
                                {notasPendientes.map((nota) => {
                                    const data = typeof nota.data === 'string' ? JSON.parse(nota.data) : nota.data;
                                    const tercero = tercerosInfo[data.tercero];
                                    return (
                                        <div key={nota.id} className="mb-4">
                                            <div className="card shadow-sm border-0">
                                                <div className="card-body-Bodega">
                                                    <p className="mb-2"><strong>Numero de Documento</strong> {data.tercero}</p>
                                                    {tercero && (
                                                        <div className="bg-light p-2 rounded mb-2">
                                                            <p className="mb-1"><strong>Nombre:</strong> {tercero.StrNombre}</p>
                                                            <p className="mb-1"><strong>Tipo ID:</strong> {tercero.StrTipoId}</p>
                                                            <p className="mb-1"><strong>Apellido 1:</strong> {tercero.StrApellido1}</p>
                                                            <p className="mb-1"><strong>Apellido 2:</strong> {tercero.StrApellido2}</p>
                                                            <p className="mb-1"><strong>Nombre 1:</strong> {tercero.StrNombre1}</p>
                                                            <p className="mb-0"><strong>Nombre 2:</strong> {tercero.StrNombre2}</p>
                                                        </div>
                                                    )}
                                                    <p className="mb-1"><strong>Transacción:</strong> {data.transaccion}</p>
                                                    <p className="mb-1"><strong>Documento:</strong> {data.documento}</p>
                                                    <p className="mb-1">
                                                        <strong>Producto(s) a cancelar:</strong>
                                                        <ul style={{ listStyle: 'none', paddingLeft: 0, marginBottom: 0 }}>
                                                            {Array.isArray(data.producto) ? data.producto.map(prod => (
                                                                <li key={prod} style={{ display: 'flex', alignItems: 'center', gap: '0.5em' }}>
                                                                    <span>{prod}</span>
                                                                    {data.cantidadesCancelar && data.cantidadesCancelar[prod] !== undefined && (
                                                                        <span className="badge cantidad-badge-Bodega-jefe">Cantidad: {data.cantidadesCancelar[prod]}</span>
                                                                    )}
                                                                </li>
                                                            )) : (
                                                                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5em' }}>
                                                                    <span>{data.producto}</span>
                                                                    {data.cantidadesCancelar && data.cantidadesCancelar[data.producto] !== undefined && (
                                                                        <span className="badge cantidad-badge-Bodega-jefe">Cantidad: {data.cantidadesCancelar[data.producto]}</span>
                                                                    )}
                                                                </li>
                                                            )}
                                                        </ul>
                                                    </p>
                                                    <p className="mb-1"><strong>Motivo:</strong> {data.motivo}</p>
                                                    <p className="mb-1"><strong>Usuario:</strong> {data.usuario}</p>
                                                    <p className="mb-2"><strong>Fecha:</strong> {nota.created_at}</p>
                                                    <button
                                                        className="btn btn-success btn-sm"
                                                        onClick={async () => {
                                                            await axios.put(`/api/notas/${nota.id}/aprobar`, { usuario: user?.name });
                                                            alert('Nota Aprobada');
                                                            await cargarNotasPendientes();
                                                        }}
                                                    >
                                                        Aprobar
                                                    </button>
                                                    <button
                                                        className="btn btn-danger btn-sm ms-2"
                                                        onClick={async () => {
                                                            if (window.confirm('¿Estás seguro que quieres eliminar esta nota?')) {
                                                                await axios.delete(`/api/notas/${nota.id}`);
                                                                await cargarNotasPendientes();
                                                            }
                                                        }}
                                                    >
                                                        Eliminar
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <div className="container mt-4">
                <h2 className="mb-4">Formulario de Reporte de Notas</h2>
                {mensaje && <div className="alert alert-info">{mensaje}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">Tercero:</label>
                        <div className="input-group">
                            <input type="text" name="tercero" className="form-control" value={form.tercero} readOnly required />
                            <button type="button" className="btn btn-secondary" onClick={() => setShowModal(true)}>
                                Buscar
                            </button>
                        </div>
                        {terceroSeleccionado && (
                            <div className="mt-2 p-2 border rounded bg-light">
                                <div><strong>Identificacion:</strong> {terceroSeleccionado.StrIdTercero}</div>
                                <div><strong>Nombre:</strong> {terceroSeleccionado.StrNombre}</div>
                                <div><strong>Tipo ID:</strong> {terceroSeleccionado.StrTipoId}</div>
                                <div><strong>Apellido1:</strong> {terceroSeleccionado.StrApellido1}</div>
                                <div><strong>Apellido2:</strong> {terceroSeleccionado.StrApellido2}</div>
                                <div><strong>Nombre1:</strong> {terceroSeleccionado.StrNombre1}</div>
                                <div><strong>Nombre2:</strong> {terceroSeleccionado.StrNombre2}</div>
                            </div>
                        )}
                    </div>
                    {showModal && (
                        <div className="modal show d-block" tabIndex="-1">
                            <div className="modal-dialog">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h5 className="modal-title">Buscar Tercero</h5>
                                        <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                                    </div>
                                    <div className="modal-body">
                                        <input
                                            type="text"
                                            className="form-control mb-2"
                                            placeholder="Buscar por nombre o ID"
                                            value={busqueda}
                                            onChange={e => setBusqueda(e.target.value)}
                                        />
                                        <div className="d-flex mb-2">
                                            <button type="button" className="btn btn-primary me-2" onClick={buscarTercero}>Buscar</button>
                                            <button type="button" className="btn btn-secondary" onClick={() => { setBusqueda(''); setResultados([]); }}>Limpiar</button>
                                        </div>
                                        <ul className="list-group">
                                            {resultados.map(t => (
                                                <li
                                                    key={t.StrIdTercero}
                                                    className="list-group-item list-group-item-action"
                                                    onClick={() => {
                                                        setForm({ ...form, tercero: t.StrIdTercero });
                                                        setTerceroSeleccionado(t);
                                                        setShowModal(false);
                                                    }}
                                                    style={{ cursor: 'pointer' }}
                                                >
                                                    <div><strong>Identificacion:</strong> {t.StrIdTercero}</div>
                                                    <div><strong>Nombre:</strong> {t.StrNombre}</div>
                                                    <div><strong>Tipo ID:</strong> {t.StrTipoId}</div>
                                                    <div><strong>Apellido1:</strong> {t.StrApellido1}</div>
                                                    <div><strong>Apellido2:</strong> {t.StrApellido2}</div>
                                                    <div><strong>Nombre1:</strong> {t.StrNombre1}</div>
                                                    <div><strong>Nombre2:</strong> {t.StrNombre2}</div>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    <div className="mb-3">
                        <label className="form-label">Transacción:</label>
                        <input
                            type="number"
                            name="transaccion"
                            className="form-control"
                            value={form.transaccion}
                            onChange={handleTransaccionDocumentoChange}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Documento:</label>
                        <input
                            type="number"
                            name="documento"
                            className="form-control"
                            value={form.documento}
                            onChange={handleTransaccionDocumentoChange}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Producto:</label>
                        <div>
                            {productosOpciones.map(p => (
                                <div key={p.StrProducto} className="form-check mb-2">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        value={p.StrProducto}
                                        checked={form.producto.includes(p.StrProducto)}
                                        onChange={e => {
                                            const value = e.target.value;
                                            setForm(prev => ({
                                                ...prev,
                                                producto: prev.producto.includes(value)
                                                    ? prev.producto.filter(v => v !== value)
                                                    : [...prev.producto, value]
                                            }));
                                            // Si se desmarca, quitar la cantidad
                                            setCantidadesCancelar(prev => {
                                                if (form.producto.includes(value)) {
                                                    const nuevo = { ...prev };
                                                    delete nuevo[value];
                                                    return nuevo;
                                                } else {
                                                    return { ...prev, [value]: 1 };
                                                }
                                            });
                                        }}
                                    />
                                    <label className="form-check-label">
                                        {p.StrProducto} (Cantidad disponible: {Number(p.IntCantidad).toFixed(2)})
                                    </label>
                                    {form.producto.includes(p.StrProducto) && (
                                        <input
                                            type="number"
                                            min={0.01}
                                            max={p.IntCantidad}
                                            step={0.01}
                                            value={cantidadesCancelar[p.StrProducto] || ''}
                                            onChange={e => {
                                                const value = parseFloat(e.target.value);
                                                setCantidadesCancelar(prev => ({
                                                    ...prev,
                                                    [p.StrProducto]: value
                                                }));
                                            }}
                                            className="form-control mt-1"
                                            style={{ width: 100 }}
                                        />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Motivo:</label>
                        <textarea
                            name="motivo"
                            className="form-control"
                            rows="3"
                            value={form.motivo}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary">Guardar Reporte</button>
                </form >
            </div >
        </div >
    );
};

export default Notas;