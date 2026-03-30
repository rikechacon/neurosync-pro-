import { useState, useEffect, useRef } from 'react';
import './FrequencyVisualizer.css';

export default function FrequencyVisualizer({ audioEngine }) {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const [frequencies, setFrequencies] = useState({
    left: 0,
    right: 0,
    beat: 0
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    const draw = () => {
      if (!audioEngine || !audioEngine.analyser) {
        animationRef.current = requestAnimationFrame(draw);
        return;
      }

      // Obtener datos de frecuencia
      const frequencyData = audioEngine.getFrequencyData();
      const info = audioEngine.getFrequencyInfo();

      if (frequencyData && info) {
        // Actualizar frecuencias numéricas
        setFrequencies({
          left: info.left,
          right: info.right,
          beat: info.beat
        });

        // Limpiar canvas
        ctx.fillStyle = 'rgba(22, 33, 62, 0.3)';
        ctx.fillRect(0, 0, width, height);

        // Dibujar espectro de frecuencias
        const barWidth = (width / frequencyData.length) * 2.5;
        let x = 0;

        frequencyData.forEach((value, i) => {
          const percent = value / 255;
          const barHeight = percent * height;
          
          // Gradiente de color basado en la frecuencia
          const hue = 240 + (i / frequencyData.length) * 60; // Azul a púrpura
          const saturation = 70 + percent * 30;
          const lightness = 40 + percent * 30;
          
          ctx.fillStyle = `hsla(${hue}, ${saturation}%, ${lightness}%, ${0.6 + percent * 0.4})`;
          ctx.fillRect(x, height - barHeight, barWidth, barHeight);
          
          x += barWidth + 1;
        });

        // Dibujar línea central (referencia)
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(width / 2, 0);
        ctx.lineTo(width / 2, height);
        ctx.stroke();
      }

      animationRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [audioEngine]);

  return (
    <div className="frequency-visualizer-container">
      <div className="visualizer-canvas-wrapper">
        <canvas 
          ref={canvasRef}
          width={400}
          height={100}
          className="frequency-canvas"
        />
      </div>
      
      <div className="frequency-numbers">
        <div className="freq-box left">
          <span className="freq-label">🎧 Izquierdo</span>
          <span className="freq-value">{frequencies.left.toFixed(1)} Hz</span>
        </div>
        
        <div className="freq-box beat">
          <span className="freq-label">🔄 Beat</span>
          <span className="freq-value">{frequencies.beat.toFixed(2)} Hz</span>
        </div>
        
        <div className="freq-box right">
          <span className="freq-label">🎧 Derecho</span>
          <span className="freq-value">{frequencies.right.toFixed(1)} Hz</span>
        </div>
      </div>
      
      <div className="freq-info">
        <span className="info-badge">
          {frequencies.beat < 4 ? '😴 Delta' : 
           frequencies.beat < 8 ? '🧘 Theta' : 
           frequencies.beat < 14 ? '🎯 Alpha' : 
           frequencies.beat < 30 ? '⚡ Beta' : '🧠 Gamma'}
        </span>
      </div>
    </div>
  );
}
