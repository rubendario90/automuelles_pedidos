import React, { useRef, useEffect, useState } from 'react';
import '../assets/SignatureCanvas.css';

const SignatureCanvas = ({ onChange }) => {
  const canvasRef = useRef(null);
  const isDrawing = useRef(false);
  const [canvasWidth, setCanvasWidth] = useState(400);

  useEffect(() => {
    // Ajusta el tamaño del canvas según el dispositivo
    const updateCanvasSize = () => {
      const width = window.innerWidth < 500 ? window.innerWidth - 40 : 400;
      setCanvasWidth(width);
      const canvas = canvasRef.current;
      const dpr = window.devicePixelRatio || 1;
      canvas.width = width * dpr; // Ajusta el tamaño en píxeles
      canvas.height = 200 * dpr; // Ajusta el tamaño en píxeles
      canvas.style.width = `${width}px`; // Ajusta el tamaño visual
      canvas.style.height = '200px'; // Ajusta el tamaño visual
      const ctx = canvas.getContext('2d');
      ctx.setTransform(1, 0, 0, 1, 0, 0); // Restablece la transformación antes de escalar
      ctx.scale(dpr, dpr); // Escala para soportar pantallas de alta densidad
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';
      ctx.strokeStyle = '#222';
    };
    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);
    return () => window.removeEventListener('resize', updateCanvasSize);
  }, []);

  // Evita el scroll de la pantalla mientras se dibuja
  useEffect(() => {
    const preventScroll = (e) => {
      if (isDrawing.current) e.preventDefault();
    };
    document.body.addEventListener('touchmove', preventScroll, { passive: false });
    return () => {
      document.body.removeEventListener('touchmove', preventScroll, { passive: false });
    };
  }, []);

  const getPos = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const scaleX = canvasRef.current.width / rect.width; // Escala horizontal
    const scaleY = canvasRef.current.height / rect.height; // Escala vertical
    if (e.touches) {
      return {
        x: (e.touches[0].clientX - rect.left) * scaleX,
        y: (e.touches[0].clientY - rect.top) * scaleY,
      };
    } else {
      return {
        x: e.nativeEvent.offsetX * scaleX,
        y: e.nativeEvent.offsetY * scaleY,
      };
    }
  };

  const startDrawing = (e) => {
    isDrawing.current = true;
    const ctx = canvasRef.current.getContext('2d');
    const { x, y } = getPos(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e) => {
    if (!isDrawing.current) return;
    const ctx = canvasRef.current.getContext('2d');
    const { x, y } = getPos(e);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    isDrawing.current = false;
    const ctx = canvasRef.current.getContext('2d');
    ctx.closePath();
    if (onChange) onChange(canvasRef.current.toDataURL('image/png'));
  };

  const startTouch = (e) => {
    e.preventDefault();
    startDrawing(e);
  };

  const drawTouch = (e) => {
    e.preventDefault();
    draw(e);
  };

  const stopTouch = (e) => {
    e.preventDefault();
    stopDrawing();
  };

  const clearCanvas = () => {
    const ctx = canvasRef.current.getContext('2d');
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    if (onChange) onChange('');
  };

  return (
    <div className="signature-canvas-container">
      <canvas
        ref={canvasRef}
        width={canvasWidth}
        height={200}
        className="signature-canvas"
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        onTouchStart={startTouch}
        onTouchMove={drawTouch}
        onTouchEnd={stopTouch}
      />
      <button className="btn btn-secondary mt-2 w-100" onClick={clearCanvas}>
        Limpiar
      </button>
    </div>
  );
};

export default SignatureCanvas;