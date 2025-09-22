import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import '../assets/css/register.css'; // Importar los estilos de login

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Fetch CSRF token
      await axios.get('/sanctum/csrf-cookie');

      // Send registration request
      const response = await axios.post('/api/register', {
        name,
        email,
        password,
        password_confirmation: passwordConfirmation,
      });
      console.log('Registro exitoso:', response.data);
      localStorage.setItem('user', JSON.stringify(response.data));
      navigate('/dashboard');
    } catch (error) {
      console.error('Error al registrarse:', error.response?.data || error.message);
      alert(error.response?.data?.message || 'Error al registrarse. Verifica los datos ingresados.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="vh-100 gradient-custom">
      <div className="container py-5 h-100">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="col-12 col-md-8 col-lg-6 col-xl-5">
            <div
              className="card text-white"
              style={{
                borderRadius: '1rem',
                background: 'rgba(13, 83, 149, 0.8)', 
              }}
            >
              <div className="card-body p-5 text-center">
                <div className="mb-md-5 mt-md-4 pb-5">
                  <h2 className="fw-bold mb-2 text-uppercase">Registro</h2>
                  <p className="text-white-50 mb-5">Por favor ingresa tus datos para registrarte</p>
                  <form onSubmit={handleSubmit}>
                    <div className="form-outline form-white mb-4">
                      <input
                        type="text"
                        id="typeNameX"
                        className="form-control form-control-lg"
                        placeholder="Nombre"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                      <label className="form-label" htmlFor="typeNameX">Nombre</label>
                    </div>
                    <div className="form-outline form-white mb-4">
                      <input
                        type="email"
                        id="typeEmailX"
                        className="form-control form-control-lg"
                        placeholder="Correo Electrónico"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                      <label className="form-label" htmlFor="typeEmailX">Correo Electrónico</label>
                    </div>
                    <div className="form-outline form-white mb-4">
                      <input
                        type="password"
                        id="typePasswordX"
                        className="form-control form-control-lg"
                        placeholder="Contraseña"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                      <label className="form-label" htmlFor="typePasswordX">Contraseña</label>
                    </div>
                    <div className="form-outline form-white mb-4">
                      <input
                        type="password"
                        id="typePasswordConfirmationX"
                        className="form-control form-control-lg"
                        placeholder="Confirmar Contraseña"
                        value={passwordConfirmation}
                        onChange={(e) => setPasswordConfirmation(e.target.value)}
                        required
                      />
                      <label className="form-label" htmlFor="typePasswordConfirmationX">Confirmar Contraseña</label>
                    </div>
                    <button
                      className="btn btn-outline-light btn-lg px-5"
                      type="submit"
                      disabled={loading}
                    >
                      {loading ? 'Cargando...' : 'Registrarse'}
                    </button>
                  </form>
                </div>
                <div>
                  <p className="mb-0">
                    ¿Ya tienes una cuenta?{' '}
                    <button
                      onClick={() => navigate('/login')}
                      className="btn btn-link text-white-50 fw-bold"
                    >
                      Inicia Sesión
                    </button>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Register;