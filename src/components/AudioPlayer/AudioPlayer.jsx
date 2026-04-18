import { useState, useEffect, useRef } from 'react';
import './AudioPlayer.css';

export default function AudioPlayer({ routine, profile, onComplete, onBack }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState({ beats: 0.1, nature: 1.0 });
  const [error, setError] = useState(null);
  
  const audioContextRef = useRef(null);
  const oscillatorsRef = useRef([]);
  const gainNodesRef = useRef({});
  const natureAudioRef = useRef(null);
  const intervalRef = useRef(null);

  // VALIDAR valores antes de usar
  const validateNumber = (value, defaultValue = 0, min = 0, max = 1000) => {
    const num = parseFloat(value);
    if (isNaN(num) || !isFinite(num)) {
      console.warn('Invalid number, using default:', defaultValue);
      return defaultValue;
    }
    return Math.max(min, Math.min(max, num));
  };

  useEffect(() => {
    startSession();
    return () => cleanup();
  }, []);

  const startSession = async () => {
    try {
      // VALIDAR rutina y perfil
      if (!routine || !profile) {
        throw new Error('Rutina o perfil no definido');
      }

      const beatFreq = validateNumber(routine.beatFreq || profile.beatFreq || 6, 6, 1, 40);
      const carrierFreq = validateNumber(routine.carrierFreq || profile.carrierFreq || 400, 400, 100, 1000);
      const duration = validateNumber(routine.duration || 20, 20, 1, 120) * 60; // minutos a segundos

      console.log('🎵 Iniciando sesión:', {
        beatFreq,
        carrierFreq,
        duration,
        profile: profile.name
      });

      // Inicializar AudioContext
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      
      // Crear nodos de audio con valores VALIDADOS
      await createBinauralBeat(carrierFreq, beatFreq);
      await loadNatureSound(profile.natureSound || 'stream');
      
      setIsPlaying(true);
      startTimer(duration);
      
    } catch (err) {
      console.error('Error iniciando sesión:', err);
      setError(err.message);
    }
  };

  const createBinauralBeat = async (carrierFreq, beatFreq) => {
    if (!audioContextRef.current) return;

    const ctx = audioContextRef.current;
    
    // VALIDAR frecuencias
    const leftFreq = validateNumber(carrierFreq - beatFreq / 2, 397, 100, 1000);
    const rightFreq = validateNumber(carrierFreq + beatFreq / 2, 403, 100, 1000);
    
    console.log('🎧 Frecuencias:', { left: leftFreq, right: rightFreq, beat: beatFreq });

    // Canal izquierdo
    const oscLeft = ctx.createOscillator();
    const gainLeft = ctx.createGain();
    oscLeft.frequency.value = leftFreq;
    oscLeft.type = 'sine';
    gainLeft.gain.value = validateNumber(volume.beats, 0.1, 0, 1);
    oscLeft.connect(gainLeft);
    gainLeft.connect(ctx.destination);
    oscLeft.start();

    // Canal derecho
    const oscRight = ctx.createOscillator();
    const gainRight = ctx.createGain();
    oscRight.frequency.value = rightFreq;
    oscRight.type = 'sine';
    gainRight.gain.value = validateNumber(volume.beats, 0.1, 0, 1);
    oscRight.connect(gainRight);
    gainRight.connect(ctx.destination);
    oscRight.start();

    // Crear canal estéreo
    const merger = ctx.createChannelMerger(2);
    const splitter = ctx.createChannelSplitter(2);
    
    oscLeft.disconnect();
    oscRight.disconnect();
    gainLeft.connect(merger, 0, 0);
    gainRight.connect(merger, 0, 1);
    merger.connect(ctx.destination);

    oscillatorsRef.current = [oscLeft, oscRight];
    gainNodesRef.current = { left: gainLeft, right: gainRight };
  };

  const loadNatureSound = async (soundType) => {
    try {
      natureAudioRef.current = new Audio();
      natureAudioRef.current.src = `/sounds/${soundType}.mp3`;
      natureAudioRef.current.loop = true;
      natureAudioRef.current.volume = validateNumber(volume.nature, 1.0, 0, 1);
      
      await natureAudioRef.current.play();
      console.log('🌊 Sonido de naturaleza cargado:', soundType);
    } catch (err) {
      console.warn('No se pudo cargar el sonido de naturaleza:', err);
    }
  };

  const startTimer = (duration) => {
    const startTime = Date.now();
    const endTime = startTime + (duration * 1000);
    
    intervalRef.current = setInterval(() => {
      const now = Date.now();
      const elapsed = (now - startTime) / 1000;
      const remaining = Math.max(0, duration - elapsed);
      
      setCurrentTime(elapsed);
      
      if (remaining <= 0) {
        handleComplete();
      }
    }, 1000);
  };

  const handleComplete = () => {
    cleanup();
    onComplete?.();
  };

  const cleanup = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    oscillatorsRef.current.forEach(osc => {
      try {
        osc.stop();
        osc.disconnect();
      } catch (e) {
        // Ya estaba detenido
      }
    });
    
    if (natureAudioRef.current) {
      natureAudioRef.current.pause();
      natureAudioRef.current = null;
    }
    
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    
    oscillatorsRef.current = [];
    gainNodesRef.current = {};
  };

  const handleVolumeChange = (type, value) => {
    const validatedValue = validateNumber(value, 0.5, 0, 1);
    setVolume(prev => ({ ...prev, [type]: validatedValue }));
    
    if (type === 'beats' && gainNodesRef.current) {
      Object.values(gainNodesRef.current).forEach(gain => {
        if (gain && gain.gain) {
          gain.gain.value = validatedValue;
        }
      });
    } else if (type === 'nature' && natureAudioRef.current) {
      natureAudioRef.current.volume = validatedValue;
    }
  };

  if (error) {
    return (
      <div className="error-container">
        <div className="error-box">
          <h2>❌ Error</h2>
          <p>{error}</p>
          <button onClick={onBack}>Volver</button>
        </div>
      </div>
    );
  }

  const progress = routine && routine.duration 
    ? (currentTime / (routine.duration * 60)) * 100 
    : 0;

  return (
    <div className="audio-player-container">
      <button className="back-button" onClick={onBack}>← Volver</button>
      
      <div className="session-info">
        <h2>{routine?.name || 'Sesión Personalizada'}</h2>
        <p className="profile-name">{profile?.name || 'Perfil personalizado'}</p>
      </div>

      <div className="frequency-display">
        <div className="freq-box">
          <span className="freq-label">Frecuencia</span>
          <span className="freq-value">{routine?.beatFreq || 6} Hz</span>
          <span className="freq-type">{profile?.brainwave || 'Alpha'}</span>
        </div>
        <div className="freq-box">
          <span className="freq-label">Sonido</span>
          <span className="freq-value">{routine?.natureSound || 'Arroyo'}</span>
        </div>
        <div className="freq-box">
          <span className="freq-label">Duración</span>
          <span className="freq-value">{routine?.duration || 20} min</span>
        </div>
      </div>

      <div className="timer-display">
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }}></div>
        </div>
        <div className="time-text">
          <span>{Math.floor(currentTime / 60)}:{String(currentTime % 60).padStart(2, '0')}</span>
          <span>{routine?.duration || 20}:00</span>
        </div>
      </div>

      <div className="controls">
        <button className="control-btn stop" onClick={handleComplete}>
          ⏹ Detener
        </button>
        <button className="control-btn pause" onClick={() => setIsPlaying(!isPlaying)}>
          {isPlaying ? '⏸ Pausar' : '▶ Reproducir'}
        </button>
      </div>

      <div className="volume-controls">
        <div className="volume-slider">
          <label>🎵 Beats</label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume.beats}
            onChange={(e) => handleVolumeChange('beats', parseFloat(e.target.value))}
          />
          <span>{Math.round(volume.beats * 100)}%</span>
        </div>
        <div className="volume-slider">
          <label>🌿 Naturaleza</label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume.nature}
            onChange={(e) => handleVolumeChange('nature', parseFloat(e.target.value))}
          />
          <span>{Math.round(volume.nature * 100)}%</span>
        </div>
      </div>

      <div className="warning-notice">
        ⚠️ Usa auriculares estéreo para experimentar los beats binaurales
      </div>
    </div>
  );
}
