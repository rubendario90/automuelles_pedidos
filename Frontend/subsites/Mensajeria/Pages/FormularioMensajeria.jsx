import React, { useState, useEffect }  from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../../src/api/axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const initialState = {
    fecha_revision: '',
    placa: '',
    mensajero: '',
    tipo_identificacion: '',
    numero_identificacion: '',
    kilometraje_inicio: '',
    observaciones: '',
    salud: '',
    licencia: '',
    soat: '',
    aceite: '',
    gasolina: '',
    bateria: '',
    guaya: '',
    freno_del: '',
    freno_tras: '',
    llantas: '',
    manijas: '',
    estribos: '',
    luces_del: '',
    luz_freno: '',
    direcc_del: '',
    direcc_tras: '',
    bocina: '',
    espejos: '',
    carroceria: '',
    epp: '',
    encendido: '',
    casco: '',
    aseo: '',
};

const opcionesCumple = [
    { name: 'salud', label: 'Estado físico y de salud del conductor' },
    { name: 'licencia', label: 'Licencia del conductor vigente y activa' },
    { name: 'soat', label: 'SOAT, Revisión técnico-mecánica vigente' },
    { name: 'aceite', label: 'Estado de nivel de aceite' },
    { name: 'gasolina', label: 'Estado de nivel de la gasolina' },
    { name: 'bateria', label: 'Estado de líquido de batería' },
    { name: 'guaya', label: 'Estado de guaya de freno' },
    { name: 'freno_del', label: 'Estado de freno delantero' },
    { name: 'freno_tras', label: 'Estado de freno trasero' },
    { name: 'llantas', label: 'Estado de llantas - labrado, presión' },
    { name: 'manijas', label: 'Estado de las manijas' },
    { name: 'estribos', label: 'Estado de los estribos' },
    { name: 'luces_del', label: 'Estado de luces delanteras (Altas - Bajas)' },
    { name: 'luz_freno', label: 'Estado de luz de freno y de posición' },
    { name: 'direcc_del', label: 'Estado de luces direccionales delanteras' },
    { name: 'direcc_tras', label: 'Estado de luces direccionales traseras' },
    { name: 'bocina', label: 'Estado de bocina' },
    { name: 'espejos', label: 'Estado de los espejos retrovisores' },
    { name: 'carroceria', label: 'Estado de carrocería' },
    { name: 'epp', label: 'Estado de los EPP' },
    { name: 'encendido', label: 'Estado de botón y pedal de encendido' },
    { name: 'casco', label: 'Estado del casco' },
    { name: 'aseo', label: 'Condiciones de aseo general' },
];

const FormularioMensajeria = () => {
    const [form, setForm] = useState(initialState);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const userId = localStorage.getItem('user_id');
        const today = new Date().toISOString().slice(0, 10);
        axios.get(`/api/revision-mensajeria-existe?user_id=${userId}&fecha=${today}`)
            .then(res => {
                if (res.data.exists) {
                    navigate('/Mensajeria');
                } else {
                    setLoading(false);
                }
            })
            .catch(() => setLoading(false));
    }, [navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        for (const op of opcionesCumple) {
            if (!form[op.name]) {
                setError(`Selecciona Cumple o No cumple para: ${op.label}`);
                return;
            }
        }
        setError('');
        try {
            const userId = localStorage.getItem('user_id');
            await axios.post('/api/guardar-revision-mensajeria', {
                user_id: userId,
                data: form,
            });
            alert('Revisión guardada correctamente');
            setForm(initialState);
            navigate('/Mensajeria');
        } catch (err) {
            setError('Error al guardar la revisión');
        }
    };

    if (loading) return <div className="container mt-4">Cargando...</div>;

    return (
        <div className="container mt-4 mb-4">
            <div className="card shadow">
                <div className="card-body">
                    <h2 className="card-title text-center mb-4">Formulario de Revisión de Motocicleta</h2>
                    {error && <div className="alert alert-danger">{error}</div>}
                    <form onSubmit={handleSubmit}>
                        <div className="row mb-3">
                            <div className="col-md-4 mb-3">
                                <label className="form-label">Fecha de la revisión</label>
                                <input type="date" name="fecha_revision" value={form.fecha_revision} onChange={handleChange} className="form-control" required />
                            </div>
                            <div className="col-md-4 mb-3">
                                <label className="form-label">Placa de la motocicleta</label>
                                <select name="placa" value={form.placa} onChange={handleChange} className="form-select" required>
                                    <option value="">Seleccione una placa</option>
                                    <option value="SYT10G">SYT10G</option>
                                    <option value="SXN62G">SXN62G</option>
                                    <option value="EPR27H">EPR27H</option>
                                    <option value="EEK41G">EEK41G</option>
                                    <option value="IKY72E">IKY72E</option>
                                    <option value="YOH80F">YOH80F</option>
                                    <option value="LRE92G">LRE92G</option>
                                    <option value="AEP699">AEP699</option>
                                </select>
                            </div>
                            <div className="col-md-4 mb-3">
                                <label className="form-label">Nombre completo del conductor</label>
                                <select name="mensajero" value={form.mensajero} onChange={handleChange} className="form-select" required>
                                    <option value="">Seleccione un mensajero</option>
                                    <option value="Daniel Velez">Daniel Velez</option>
                                    <option value="Jorge Pereira">Jorge Pereira</option>
                                    <option value="Sebastian Sepúlveda">Sebastian Sepúlveda</option>
                                    <option value="Julián David Carvajal Gómez">Julián David Carvajal Gómez</option>
                                    <option value="Brayan Mazo">Brayan Mazo</option>
                                </select>
                            </div>
                            <div className="col-md-4 mb-3">
                                <label className="form-label">Tipo de identificación</label>
                                <select name="tipo_identificacion" value={form.tipo_identificacion} onChange={handleChange} className="form-select" required>
                                    <option value="">Seleccione un tipo de identificación</option>
                                    <option value="CC">Cédula de ciudadanía (CC)</option>
                                    <option value="TE">Tarjeta de extranjería (TE)</option>
                                    <option value="CE">Cédula de extranjería (CE)</option>
                                    <option value="PEP">Permiso especial de permanencia (PEP)</option>
                                    <option value="PP">Pasaporte (PP)</option>
                                </select>
                            </div>
                            <div className="col-md-4 mb-3">
                                <label className="form-label">Número de identificación</label>
                                <input type="text" name="numero_identificacion" value={form.numero_identificacion} onChange={handleChange} className="form-control" required />
                            </div>
                            <div className="col-md-4 mb-3">
                                <label className="form-label">Kilometraje de inicio</label>
                                <input type="number" name="kilometraje_inicio" value={form.kilometraje_inicio} onChange={handleChange} className="form-control" required />
                            </div>
                        </div>
                        <h5 className="mb-3 mt-4">Evaluación</h5>
                        <div className="row">
                            {opcionesCumple.map(op => (
                                <div key={op.name} className="col-md-6 mb-3">
                                    <div className="card p-2">
                                        <span className="form-label">{op.label}</span>
                                        <div className="form-check form-check-inline ms-2">
                                            <input
                                                type="radio"
                                                className="form-check-input"
                                                name={op.name}
                                                value="Cumple"
                                                checked={form[op.name] === 'Cumple'}
                                                onChange={handleChange}
                                                required
                                            />
                                            <label className="form-check-label">Cumple</label>
                                        </div>
                                        <div className="form-check form-check-inline">
                                            <input
                                                type="radio"
                                                className="form-check-input"
                                                name={op.name}
                                                value="No cumple"
                                                checked={form[op.name] === 'No cumple'}
                                                onChange={handleChange}
                                                required
                                            />
                                            <label className="form-check-label">No cumple</label>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mb-4 mt-3">
                            <label className="form-label">Observaciones generales</label>
                            <textarea name="observaciones" value={form.observaciones} onChange={handleChange} className="form-control" rows="3" required />
                        </div>
                        <div className="text-center">
                            <button type="submit" className="btn btn-primary px-5">Guardar</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default FormularioMensajeria;