import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import axios from '../api/axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../assets/css/login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth(); // Obtener la función login del contexto
  const navigate = useNavigate(); // Hook para redirigir

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.get('/sanctum/csrf-cookie');
      const response = await axios.post('/api/login', { email, password });
      const userData = response.data;

      // Guarda los datos en localStorage
      localStorage.setItem('user_id', userData.id);
      localStorage.setItem('user_name', userData.name);
      localStorage.setItem('user_role', userData.role);

      login(userData);
      console.log('Inicio de sesión exitoso:', userData);

      // Redirigir al dashboard o a la página correspondiente según el rol
      if (userData.role === 'users') {
        navigate('/dashboard');
      } else if (userData.role === 'Bodega') {
        navigate('/bodega');
      } else if (userData.role === 'JefeBodega') {
        navigate('/jefe-bodega');
      } else if (userData.role === 'BodegaJefe') {
        navigate('/bodega-jefe');
      }
      else if (userData.role === 'JefeCedi') {
        navigate('/jefe-cedi');
      }
      else if (userData.role === 'Despachos') {
        navigate('/Despachos');
      }
      else if (userData.role === 'Mensajeria') {
        navigate('/Mensajeria/FormularioMensajeria');
      }
      else if (userData.role === 'Vendedor') {
        navigate('/Vendedores');
      }
      else if (userData.role === 'Mostrador') {
        navigate('/Mostrador');
      }
      else if (userData.role === 'Notas') {
        navigate('/Notas');
      }
    } catch (error) {
      console.error('Error al iniciar sesión:', error.response?.data || error.message);
      alert(error.response?.data?.message || 'Error al iniciar sesión. Verifica tus credenciales.');
    } finally {
      setLoading(false);
    }
  };

  const goToRegister = () => {
    navigate('/register'); // Redirigir al formulario de registro
  };

  return (
    <section className="vh-100" style={{ background: '#f8f9fa' }}>
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
                  <h2 className="fw-bold mb-2 text-uppercase">Iniciar sesion</h2>
                  <p className="text-white-50 mb-5">Por favor ingresa tu correo y contraseña</p>
                  <form onSubmit={handleSubmit}>
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
                    <button
                      className="btn btn-outline-light btn-lg px-5"
                      type="submit"
                      disabled={loading}
                    >
                      {loading ? 'Cargando...' : 'Iniciar Sesión'}
                    </button>
                  </form>
                  <p className="small mb-5 pb-lg-2">
                    <a className="text-white-50" href="#!">¿Olvidaste tu contraseña?</a>
                  </p>
                  <div className="d-flex justify-content-center text-center mt-4 pt-1">
                    <a href="#!" className="text-white"><i className="fab fa-facebook-f fa-lg"></i></a>
                    <a href="#!" className="text-white"><i className="fab fa-twitter fa-lg mx-4 px-2"></i></a>
                    <a href="#!" className="text-white"><i className="fab fa-google fa-lg"></i></a>
                  </div>
                </div>
                <div>
                  <p className="mb-0">
                    ¿No tienes una cuenta?{' '}
                    <button
                      onClick={goToRegister}
                      className="btn btn-link text-white-50 fw-bold"
                    >
                      Regístrate
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

export default Login;