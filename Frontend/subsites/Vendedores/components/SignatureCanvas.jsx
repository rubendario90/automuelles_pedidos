import React, { useRef, useEffect, useState } from 'react';
import '../assets/SignatureCanvas.css';

const SignatureCanvas = ({ onChange }) => {
  const canvasRef = useRef(null);
  const isDrawing = useRef(false);
  const [canvasWidth, setCanvasWidth] = useState(400);

  useEffect(() => {
    const updateCanvasSize = () => {
      const isTablet = window.innerWidth >= 500 && window.innerWidth <= 1024;
      const width = isTablet ? 600 : window.innerWidth < 500 ? window.innerWidth - 40 : 400;
      setCanvasWidth(width);
      const canvas = canvasRef.current;
      const dpr = window.devicePixelRatio || 1;
      canvas.width = width * dpr;
      canvas.height = 200 * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = '200px';
      const ctx = canvas.getContext('2d');
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';
      ctx.strokeStyle = '#222';
    };
    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);
    return () => window.removeEventListener('resize', updateCanvasSize);
  }, []);

  const getPos = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
  
    let clientX, clientY;
  
    // Manejar eventos táctiles
    if (e.type.startsWith('touch') && e.touches && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    }
    // Manejar eventos de puntero o ratón
    else if (e.clientX !== undefined && e.clientY !== undefined) {
      clientX = e.clientX;
      clientY = e.clientY;
    }
    // Fallback para eventos nativos
    else if (e.nativeEvent && e.nativeEvent.clientX !== undefined) {
      clientX = e.nativeEvent.clientX;
      clientY = e.nativeEvent.clientY;
    } else {
      // Evitar errores si no se pueden obtener coordenadas
      return { x: 0, y: 0 };
    }
  
    const x = (clientX - rect.left) * scaleX;
    const y = (clientY - rect.top) * scaleY;
    return { x, y };
  };

  const handlePointerDown = (e) => {
    e.preventDefault();
    isDrawing.current = true;
    const ctx = canvasRef.current.getContext('2d');
    const { x, y } = getPos(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
  };
  
  const handlePointerMove = (e) => {
    if (!isDrawing.current) return;
    e.preventDefault();
    const ctx = canvasRef.current.getContext('2d');
    const { x, y } = getPos(e);
    ctx.lineTo(x, y);
    ctx.stroke();
  };
  
  const handlePointerUp = (e) => {
    e.preventDefault();
    isDrawing.current = false;
    const ctx = canvasRef.current.getContext('2d');
    ctx.closePath();
    if (onChange) onChange(canvasRef.current.toDataURL('image/png'));
  };

  const clearCanvas = () => {
    const ctx = canvasRef.current.getContext('2d');
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    if (onChange) onChange('');
  };

  return (
    <div className="signature-canvas-container-mostrador">
      <canvas
        ref={canvasRef}
        width={canvasWidth}
        height={200}
        className="signature-canvas-mostrador"
        style={{ touchAction: 'none' }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      />
      <button className="btn btn-secondary mt-2 w-100" onClick={clearCanvas}>
        Limpiar
      </button>
    </div>
  );
};

export default SignatureCanvas;