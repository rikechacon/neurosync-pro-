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
  const isPlayingRef = useRef(false);

  const validateNumber = (value, defaultValue = 0, min = 0, max = 1000) => {
    const num = parseFloat(value);
    if (isNaN(num) || !isFinite(num)) return defaultValue;
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

      const beatFreq = profile.defaultBeatFreq || routine.beatFreq || 10;
      const carrierFreq = profile.carrierFreq || routine.carrierFreq || 300;
      const duration = routine.duration || 20;

      console.log('🎵 Iniciando sesión:', {
        profile: profile.name,
        beatFreq,
        carrierFreq,
        duration
      });

      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      
      if (profile.id?.includes('solfeggio')) {
        await createPureTone(carrierFreq);
      } else {
        await createBinauralBeat(carrierFreq, beatFreq);
      }
      
      await loadNatureSound(profile.natureSound || 'stream');
      
      // Iniciar reproducción automáticamente
      setIsPlaying(true);
      isPlayingRef.current = true;
      startTimer(duration);
      
    } catch (err) {
      console.error('Error:', err);
      setError(err.message);
    }
  };

  const createBinauralBeat = async (carrierFreq, beatFreq) => {
    if (!audioContextRef.current) return;

    const ctx = audioContextRef.current;
    const leftFreq = carrierFreq - beatFreq / 2;
    const rightFreq = carrierFreq + beatFreq / 2;
    
    console.log('🎧 Frecuencias:', { left: leftFreq, right: rightFreq });

    const oscLeft = ctx.createOscillator();
    const gainLeft = ctx.createGain();
    oscLeft.frequency.value = leftFreq;
    oscLeft.type = 'sine';
    gainLeft.gain.value = volume.beats;
    oscLeft.connect(gainLeft);
    gainLeft.connect(ctx.destination);
    oscLeft.start();

    const oscRight = ctx.createOscillator();
    const gainRight = ctx.createGain();
    oscRight.frequency.value = rightFreq;
    oscRight.type = 'sine';
    gainRight.gain.value = volume.beats;
    oscRight.connect(gainRight);
    gainRight.connect(ctx.destination);
    oscRight.start();

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
      console.log('🌊 Sonido:', soundType);
    } catch (err) {
      console.warn('No se cargó sonido de naturaleza:', err);
    }
  };

  // FUNCIÓN DE PAUSA/REPRODUCCIÓN ARREGLADA
  const togglePlayPause = () => {
    if (isPlayingRef.current) {
      // PAUSAR
      console.log('⏸ Pausando...');
      
      // Pausar osciladores
      oscillatorsRef.current.forEach(osc => {
        try {
          // Los osciladores no se pueden pausar, solo detener
          // Pero podemos mutear el gain
          osc.disconnect();
        } catch (e) {
          console.error('Error pausando oscilador:', e);
        }
      });
      
      // Pausar audio de naturaleza
      if (natureAudioRef.current) {
        natureAudioRef.current.pause();
      }
      
      // Detener timer
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      
      isPlayingRef.current = false;
      setIsPlaying(false);
      
    } else {
      // REPRODUCIR
      console.log('▶ Reproduciendo...');
      
      // Reanudar audio de naturaleza
      if (natureAudioRef.current) {
        natureAudioRef.current.play();
      }
      
      // Reiniciar osciladores si es necesario
      if (oscillatorsRef.current.length === 0 && audioContextRef.current) {
        // Si no hay osciladores, necesitamos recrearlos
        const profile = routine?.profile || 'alpha';
        const beatFreq = 10;
        const carrierFreq = 300;
        createBinauralBeat(carrierFreq, beatFreq);
      }
      
      // Reiniciar timer
      startTimer(20); // Duración por defecto
      
      isPlayingRef.current = true;
      setIsPlaying(true);
    }
  };

  const startTimer = (durationMinutes) => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    const durationSeconds = durationMinutes * 60;
    const startTime = Date.now() - (currentTime * 1000);
    
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
    isPlayingRef.current = false;
    setIsPlaying(false);
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
        <button 
          className="control-btn pause" 
          onClick={togglePlayPause}
        >
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
