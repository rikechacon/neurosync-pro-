import { useState, useEffect } from 'react';
import { audioEngine } from '../../services/audioGenerator';
import './AudioPlayer.css';

export default function AudioPlayer({ routine, profile, onComplete, onBack }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [beatsVolume, setBeatsVolume] = useState(0.25);
  const [natureVolume, setNatureVolume] = useState(0.6);
  const [timeRemaining, setTimeRemaining] = useState(routine?.duration || 300);
  const [error, setError] = useState(null);
  const [freqInfo, setFreqInfo] = useState({ left: 0, right: 0, beat: 0 });

  useEffect(() => {
    if (!routine) {
      setError('No hay rutina configurada');
      return;
    }

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
    };
  }, [routine, onComplete]);

  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        const info = audioEngine.getFrequencyInfo();
        if (info) setFreqInfo(info);
      }, 500);
      return () => clearInterval(interval);
    }
  }, [isPlaying]);

  const handlePlayPause = async () => {
    try {
      setError(null);
      
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
          scanSequence: routine.scanSequence,
          isHealing: routine.isHealing,
          therapeuticFrequency: routine.beatFreq,
          answers: routine.answers
        }, profile);
        
        audioEngine.setBeatsVolume(beatsVolume);
        audioEngine.setNatureVolume(natureVolume);
        setIsPlaying(true);
      }
    } catch (err) {
      console.error('Error en play/pause:', err);
      setError(err.message);
    }
  };

  const handleStop = () => {
    try {
      audioEngine.stop();
      setIsPlaying(false);
      setProgress(0);
      setTimeRemaining(routine.duration);
    } catch (err) {
      console.error('Error al detener:', err);
    }
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

  const isHealing = routine?.isHealing || routine?.beatFreq >= 30;
  const displayLeft = isHealing ? routine?.beatFreq : routine?.carrierFreq;
  const displayRight = isHealing ? routine?.beatFreq : (routine?.carrierFreq + routine?.beatFreq);

  if (error) {
    return (
      <div className="audio-player-container">
        <div className="error-box">
          <h3>❌ Error</h3>
          <p>{error}</p>
          <button onClick={onBack}>Volver</button>
        </div>
      </div>
    );
  }

  return (
    <div className="audio-player-container">
      <div className="player-header">
        <button className="back-button" onClick={onBack}>← Volver</button>
        <div className="session-badge">{routine?.icon || '🎧'} {routine?.name || 'Sesión'}</div>
      </div>

      {/* Mostrar perfil activo */}
      {profile && (
        <div className="profile-badge">
          <span className="profile-icon">🧠</span>
          <span className="profile-name">{profile.name}</span>
          <span className="profile-description">{profile.message}</span>
        </div>
      )}

      <div className="frequency-display-simple">
        <div className="freq-info-box">
          <span className="freq-label">🎧 Izquierdo</span>
          <span className="freq-value">{freqInfo.left || displayLeft} Hz</span>
        </div>
        <div className="freq-info-box beat">
          <span className="freq-label">{isHealing ? '🎵 Frecuencia' : '🔄 Beat'}</span>
          <span className="freq-value">{freqInfo.beat || routine?.beatFreq} Hz</span>
        </div>
        <div className="freq-info-box">
          <span className="freq-label">🎧 Derecho</span>
          <span className="freq-value">{freqInfo.right || displayRight} Hz</span>
        </div>
        <div className="band-badge">
          {isHealing ? '💚 Tono Puro' : (routine?.band || 'theta')}
        </div>
      </div>

      <div className="session-info">
        <div className="info-card primary">
          <span className="info-label">Frecuencia</span>
          <span className="info-value">
            {routine?.beatFreq} Hz {isHealing ? '(solfeggio)' : `(${routine?.band || 'theta'})`}
          </span>
        </div>
        <div className="info-card secondary">
          <span className="info-label">Sonido de fondo</span>
          <span className="info-value">{routine?.natureSoundName || 'Ninguno'}</span>
        </div>
        <div className="info-card tertiary">
          <span className="info-label">Duración</span>
          <span className="info-value">{Math.floor(routine.duration / 60)} min</span>
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

      {isHealing && (
        <div className="healing-notice">
          <span className="notice-icon">💚</span>
          <p><strong>Modo Tono Puro:</strong> Frecuencia {routine?.beatFreq} Hz en ambos canales</p>
        </div>
      )}

      {profile?.frequencyRamp?.enabled && (
        <div className="ramp-notice">
          <span className="notice-icon">📈</span>
          <p><strong>Frecuencia Adaptativa:</strong> La frecuencia cambiará gradualmente durante la sesión</p>
        </div>
      )}
    </div>
  );
}
