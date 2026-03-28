import { useState, useEffect } from 'react';
import { audioEngine } from '../../services/audioGenerator';
import './AudioPlayer.css';

export default function AudioPlayer({ routine, onComplete, onBack }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [beatsVolume, setBeatsVolume] = useState(0.25);
  const [natureVolume, setNatureVolume] = useState(0.6);
  const [timeRemaining, setTimeRemaining] = useState(routine?.duration || 300);
  const [currentSchumannFreq, setCurrentSchumannFreq] = useState(routine.beatFreq);

  useEffect(() => {
    audioEngine.onProgress = (prog) => {
      setProgress(prog);
      const remaining = Math.max(0, routine.duration - Math.floor(prog * routine.duration));
      setTimeRemaining(remaining);
      
      // Actualizar frecuencia si es modo scan
      if (routine.isSchumann && routine.schumannMode === 'scan') {
        const freq = audioEngine.getCurrentFrequency?.() || routine.beatFreq;
        setCurrentSchumannFreq(freq);
      }
    };

    audioEngine.onComplete = () => {
      setIsPlaying(false);
      setProgress(1);
      onComplete?.();
    };

    return () => audioEngine.stop();
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
        duration: routine.duration,
        isSchumann: routine.isSchumann,
        schumannMode: routine.schumannMode,
        scanSequence: routine.scanSequence
      });
      audioEngine.setBeatsVolume(beatsVolume);
      audioEngine.setNatureVolume(natureVolume);
      setIsPlaying(true);
    }
  };

  const handleStop = () => {
    audioEngine.stop();
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

  // Badge especial para Schumann
  const renderSchumannBadge = () => {
    if (!routine.isSchumann) return null;
    
    const modeLabels = {
      fundamental: 'Fundamental 7.83 Hz',
      harmonic: `${routine.harmonicOrder}º Armónico`,
      scan: 'Escaneo Armónico'
    };
    
    return (
      <div className="schumann-badge">
        <span className="earth-icon">🌍</span>
        <span className="mode-label">{modeLabels[routine.schumannMode]}</span>
        {routine.schumannMode === 'scan' && (
          <span className="scan-indicator">
            {currentSchumannFreq?.toFixed(2)} Hz
          </span>
        )}
      </div>
    );
  };

  return (
    <div className="audio-player-container">
      <div className="player-header">
        <button className="back-button" onClick={onBack}>← Volver</button>
        {renderSchumannBadge()}
        {!routine.isSchumann && (
          <div className="session-badge">{routine.icon} {routine.name}</div>
        )}
      </div>

      {/* Visualizador con estilo Schumann */}
      <div className={`visualizer-wrapper ${routine.isSchumann ? 'schumann-mode' : ''}`}>
        <div className="visualizer">
          {[...Array(7)].map((_, i) => (
            <div
              key={i}
              className={`visualizer-bar ${isPlaying ? 'active' : ''}`}
              style={{ 
                animationDelay: `${i * 0.08}s`,
                background: routine.isSchumann 
                  ? `hsl(${200 + i * 20}, 70%, 50%)` 
                  : 'linear-gradient(180deg, #6366f1, #8b5cf6)'
              }}
            />
          ))}
        </div>
        {routine.isSchumann && (
          <div className="schumann-wave-label">
            Resonancia Terrestre • {currentSchumannFreq?.toFixed(2) || routine.beatFreq} Hz
          </div>
        )}
      </div>

      <div className="session-info">
        <div className={`info-card primary ${routine.isSchumann ? 'schumann' : ''}`}>
          <span className="info-label">Frecuencia</span>
          <span className="info-value">
            {routine.isSchumann 
              ? `🌍 ${currentSchumannFreq?.toFixed(2) || routine.beatFreq} Hz` 
              : `${routine.beatFreq} Hz (${routine.band})`}
          </span>
        </div>
        <div className="info-card secondary">
          <span className="info-label">Sonido de fondo</span>
          <span className="info-value">{routine.natureSoundName}</span>
        </div>
        {routine.isSchumann && (
          <div className="info-card tertiary schumann-info">
            <span className="info-label">Beneficios Schumann</span>
            <span className="info-value">{routine.benefits?.[0]}</span>
          </div>
        )}
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
          className={`control-btn play ${isPlaying ? 'playing' : ''} ${routine.isSchumann ? 'schumann-play' : ''}`} 
          onClick={handlePlayPause}
        >
          {isPlaying ? '⏸️' : progress === 1 ? '🔄' : '▶️'}
        </button>
      </div>

      <div className="volume-controls">
        <div className="volume-slider">
          <label>🎧 Beats</label>
          <input type="range" min="0" max="1" step="0.05" value={beatsVolume} onChange={handleBeatsVolumeChange} />
          <span className="volume-value">{Math.round(beatsVolume * 100)}%</span>
        </div>
        <div className="volume-slider">
          <label>🎵 Naturaleza</label>
          <input type="range" min="0" max="1" step="0.05" value={natureVolume} onChange={handleNatureVolumeChange} />
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

      {routine.isSchumann && (
        <div className="schumann-info-box">
          <h4>🌍 Sobre la Resonancia Schumann</h4>
          <p>La frecuencia fundamental de 7.83 Hz es la resonancia electromagnética natural de la cavidad Tierra-ionosfera. Estudios sugieren que la exposición a esta frecuencia puede apoyar la sincronización de ritmos biológicos.</p>
          <p className="schumann-note"><em>Nota: Este producto no es un dispositivo médico.</em></p>
        </div>
      )}
    </div>
  );
}
