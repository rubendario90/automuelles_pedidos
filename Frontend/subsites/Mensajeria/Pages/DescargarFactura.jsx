import React, { useState } from 'react';
import Navbar from '../components/navbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../assets/DescargarFactura.css';

const DescargarFactura = () => {
  const [facturaId, setFacturaId] = useState('');
  const [transaccion, setTransaccion] = useState('');
  const [pdfPath, setPdfPath] = useState('');
  const [error, setError] = useState('');

  const handleBuscar = async (e) => {
    e.preventDefault();
    setError('');
    setPdfPath('');
    try {
      const fileName = `${transaccion}-${facturaId}.pdf`;
      const url = `/api/descargar-factura/${fileName}`;
      // Verifica si el archivo existe
      const response = await fetch(url, { method: 'HEAD' });
      if (response.ok) {
        setPdfPath(url);
      } else {
        setError('No se encontró el PDF para esos datos.');
      }
    } catch {
      setError('Error al buscar el PDF.');
    }
  };

  return (
    <>
      <Navbar />
      <div className="descargar-factura-container with-sidebar">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-6 col-md-8 col-sm-12">
              <div className="descargar-factura-card">
                <h2 className="text-center mb-4">Descargar Factura Firmada</h2>
                <form onSubmit={handleBuscar}>
                  <div className="mb-3">
                    <label className="form-label">Transacción:</label>
                    <input
                      type="text"
                      className="form-control"
                      value={transaccion}
                      onChange={e => setTransaccion(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Número de Factura:</label>
                    <input
                      type="text"
                      className="form-control"
                      value={facturaId}
                      onChange={e => setFacturaId(e.target.value)}
                      required
                    />
                  </div>
                  <button type="submit" className="btn btn-primary w-100">Buscar</button>
                </form>

                {pdfPath && (
                  <div className="mt-4">
                    <h5>Vista previa:</h5>
                    <iframe
                      src={pdfPath}
                      title="Vista previa PDF"
                      className="pdf-preview"
                      width="100%"
                      height="400px"
                    />
                    <div className="d-grid gap-2 mt-3">
                      <a href={pdfPath} download className="btn btn-success">
                        Descargar PDF
                      </a>
                    </div>
                  </div>
                )}

                {error && <div className="alert alert-danger mt-3">{error}</div>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DescargarFactura;