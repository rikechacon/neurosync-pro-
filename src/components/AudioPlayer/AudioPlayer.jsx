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

  const validateNumber = (value, defaultValue = 0, min = 0, max = 1000) => {
    const num = parseFloat(value);
    if (isNaN(num) || !isFinite(num)) {
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
      if (!routine || !profile) {
        throw new Error('Rutina o perfil no definido');
      }

      // Obtener frecuencias del perfil
      const beatFreq = profile.defaultBeatFreq || routine.beatFreq || 10;
      const carrierFreq = profile.carrierFreq || routine.carrierFreq || 300;
      const duration = routine.duration || 20; // minutos

      console.log('🎵 Iniciando sesión:', {
        profile: profile.name,
        beatFreq,
        carrierFreq,
        duration,
        brainwave: profile.brainwave
      });

      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      
      // Crear beats binaurales con frecuencias correctas
      if (profile.id.includes('solfeggio')) {
        // Frecuencias Solfeggio - tono puro
        await createPureTone(carrierFreq);
      } else {
        // Beats binaurales normales
        await createBinauralBeat(carrierFreq, beatFreq);
      }
      
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
    
    const leftFreq = carrierFreq - beatFreq / 2;
    const rightFreq = carrierFreq + beatFreq / 2;
    
    console.log('🎧 Frecuencias binaurales:', { 
      carrier: carrierFreq, 
      beat: beatFreq,
      left: leftFreq, 
      right: rightFreq 
    });

    // Canal izquierdo
    const oscLeft = ctx.createOscillator();
    const gainLeft = ctx.createGain();
    oscLeft.frequency.value = leftFreq;
    oscLeft.type = 'sine';
    gainLeft.gain.value = volume.beats;
    oscLeft.connect(gainLeft);
    gainLeft.connect(ctx.destination);
    oscLeft.start();

    // Canal derecho
    const oscRight = ctx.createOscillator();
    const gainRight = ctx.createGain();
    oscRight.frequency.value = rightFreq;
    oscRight.type = 'sine';
    gainRight.gain.value = volume.beats;
    oscRight.connect(gainRight);
    gainRight.connect(ctx.destination);
    oscRight.start();

    // Estéreo
    const merger = ctx.createChannelMerger(2);
    gainLeft.disconnect();
    gainRight.disconnect();
    gainLeft.connect(merger, 0, 0);
    gainRight.connect(merger, 0, 1);
    merger.connect(ctx.destination);

    oscillatorsRef.current = [oscLeft, oscRight];
    gainNodesRef.current = { left: gainLeft, right: gainRight };
  };

  const createPureTone = async (frequency) => {
    if (!audioContextRef.current) return;

    const ctx = audioContextRef.current;
    
    console.log('🎵 Frecuencia pura:', frequency, 'Hz');

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.frequency.value = frequency;
    osc.type = 'sine';
    gain.gain.value = volume.beats;
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();

    oscillatorsRef.current = [osc];
    gainNodesRef.current = { main: gain };
  };

  const loadNatureSound = async (soundType) => {
    try {
      natureAudioRef.current = new Audio();
      natureAudioRef.current.src = `/sounds/${soundType}.mp3`;
      natureAudioRef.current.loop = true;
      natureAudioRef.current.volume = volume.nature;
      
      await natureAudioRef.current.play();
      console.log('🌊 Sonido de naturaleza:', soundType);
    } catch (err) {
      console.warn('No se pudo cargar sonido de naturaleza:', err);
    }
  };

  const startTimer = (durationMinutes) => {
    const durationSeconds = durationMinutes * 60;
    const startTime = Date.now();
    
    intervalRef.current = setInterval(() => {
      const elapsed = (Date.now() - startTime) / 1000;
      const remaining = Math.max(0, durationSeconds - elapsed);
      
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
      } catch (e) {}
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

  const durationSeconds = (routine?.duration || 20) * 60;
  const progress = (currentTime / durationSeconds) * 100;
  
  const minutes = Math.floor(currentTime / 60);
  const seconds = Math.floor(currentTime % 60);
  const totalMinutes = Math.floor(durationSeconds / 60);
  const totalSeconds = durationSeconds % 60;

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
          <span className="freq-value">
            {profile?.id?.includes('solfeggio') 
              ? `${profile.carrierFreq || 528} Hz`
              : `${profile?.defaultBeatFreq || routine?.beatFreq || 10} Hz`
            }
          </span>
          <span className="freq-type">{profile?.brainwave || 'Alpha'}</span>
        </div>
        <div className="freq-box">
          <span className="freq-label">Sonido</span>
          <span className="freq-value">{profile?.natureSound || routine?.natureSound || 'Arroyo'}</span>
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
          <span>{minutes}:{String(seconds).padStart(2, '0')}</span>
          <span>{totalMinutes}:{String(totalSeconds).padStart(2, '0')}</span>
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
