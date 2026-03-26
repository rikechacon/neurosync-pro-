import { useState, useEffect } from 'react';
import { audioEngine } from '../../services/audioGenerator';
import './AudioPlayer.css';

export default function AudioPlayer({ routine, onComplete, onBack }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [beatsVolume, setBeatsVolume] = useState(0.25); // Más bajo por defecto
  const [natureVolume, setNatureVolume] = useState(0.6); // Más alto por defecto
  const [timeRemaining, setTimeRemaining] = useState(routine?.duration || 300);

  useEffect(() => {
    audioEngine.onProgress = (prog) => {
      setProgress(prog);
      const remaining = Math.max(0, routine.duration - Math.floor(prog * routine.duration));
      setTimeRemaining(remaining);
    };

    audioEngine.onComplete = () => {
      setIsPlaying(false);
      setProgress(1);
      onComplete?.();
    };

    return () => {
      audioEngine.stop();
      console.log("🔍 Estado tras stop:", audioEngine.getStatus());
    };
  }, [routine, onComplete]);

  const handlePlayPause = async () => {
    if (isPlaying) {
      await audioEngine.pause();
      setIsPlaying(false);
    } else {
      if (progress === 1) {
        setProgress(0);
        setTimeRemaining(routine.duration);
      }
      await audioEngine.playRoutine({
        carrierFreq: routine.carrierFreq,
        beatFreq: routine.beatFreq,
        natureSoundUrl: routine.natureSound,
        duration: routine.duration
      });
      // Aplicar volúmenes iniciales
      audioEngine.setBeatsVolume(beatsVolume);
      audioEngine.setNatureVolume(natureVolume);
      setIsPlaying(true);
    }
  };

  const handleStop = () => {
    audioEngine.stop();
      console.log("🔍 Estado tras stop:", audioEngine.getStatus());
    setIsPlaying(false);
    setProgress(0);
    setTimeRemaining(routine.duration);
  };

  const handleBeatsVolumeChange = (e) => {
    const value = parseFloat(e.target.value);
    setBeatsVolume(value);
    audioEngine.setBeatsVolume(value);
  };

  const handleNatureVolumeChange = (e) => {
    const value = parseFloat(e.target.value);
    setNatureVolume(value);
    audioEngine.setNatureVolume(value);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="audio-player-container">
      <div className="player-header">
        <button className="back-button" onClick={onBack}>← Volver</button>
        <div className="session-badge">
          {routine.icon} {routine.name}
        </div>
      </div>

      <div className="visualizer-wrapper">
        <div className="visualizer">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className={`visualizer-bar ${isPlaying ? 'active' : ''}`}
              style={{ animationDelay: `${i * 0.1}s` }}
            />
          ))}
        </div>
      </div>

      <div className="session-info">
        <div className="info-card primary">
          <span className="info-label">Frecuencia</span>
          <span className="info-value">{routine.beatFreq} Hz ({routine.band})</span>
        </div>
        <div className="info-card secondary">
          <span className="info-label">Sonido de fondo</span>
          <span className="info-value">{routine.natureSoundName}</span>
        </div>
      </div>

      <div className="progress-section">
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress * 100}%` }} />
        </div>
        <div className="time-display">
          <span>{formatTime(routine.duration - timeRemaining)}</span>
          <span>{formatTime(timeRemaining)}</span>
        </div>
      </div>

      <div className="controls-main">
        <button className="control-btn stop" onClick={handleStop}>⏹️</button>
        <button 
          className={`control-btn play ${isPlaying ? 'playing' : ''}`} 
          onClick={handlePlayPause}
        >
          {isPlaying ? '⏸️' : progress === 1 ? '🔄' : '▶️'}
        </button>
      </div>

      {/* Controles de volumen SEPARADOS */}
      <div className="volume-controls">
        <div className="volume-slider">
          <label>🎧 Beats Binaurales</label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={beatsVolume}
            onChange={handleBeatsVolumeChange}
          />
          <span className="volume-value">{Math.round(beatsVolume * 100)}%</span>
        </div>
        
        <div className="volume-slider">
          <label>🎵 Sonido de Naturaleza</label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={natureVolume}
            onChange={handleNatureVolumeChange}
          />
          <span className="volume-value">{Math.round(natureVolume * 100)}%</span>
        </div>
      </div>

      <div className="headphone-warning">
        <span className="warning-icon">⚠️</span>
        <div className="warning-text">
          <strong>Usa auriculares estéreo</strong>
          <p>Los beats binaurales requieren auriculares para funcionar</p>
        </div>
      </div>

      {/* Debug info */}
      <div className="debug-info" style={{
        background: 'rgba(99, 102, 241, 0.1)',
        padding: '1rem',
        borderRadius: '8px',
        fontSize: '0.8rem',
        fontFamily: 'monospace'
      }}>
        <p><strong>Configuración:</strong></p>
        <p>Beats: {routine.beatFreq} Hz | Portadora: {routine.carrierFreq} Hz</p>
        <p>Sonido: {routine.natureSound || 'Ninguno'}</p>
        <p>Abre Console (F12) para ver logs detallados</p>
      </div>
    </div>
  );
}
