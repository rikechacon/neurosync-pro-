import { useState, useEffect, useRef } from 'react';
import './AudioPlayer.css';

export default function AudioPlayer({ routine, profile, onComplete, onBack }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState({ beats: 0.1, nature: 1.0 });
  const [error, setError] = useState(null);
  const [displayFreq, setDisplayFreq] = useState(null);
  const [isRamping, setIsRamping] = useState(false);
  
  const audioContextRef = useRef(null);
  const oscillatorsRef = useRef([]);
  const gainNodesRef = useRef({});
  const masterGainRef = useRef(null);
  const natureAudioRef = useRef(null);
  const intervalRef = useRef(null);
  const freqRampRef = useRef(null);
  const startTimeRef = useRef(0);
  const pausedTimeRef = useRef(0);

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

      const beatFreq = profile.defaultBeatFreq || 10;
      const carrierFreq = profile.carrierFreq || 300;
      const duration = routine.duration || 20;

      console.log('🎵 Sesión:', {
        profile: profile.name,
        beatFreq,
        carrierFreq,
        duration,
        brainwave: profile.brainwave
      });

      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      
      masterGainRef.current = audioContextRef.current.createGain();
      masterGainRef.current.gain.value = 1;
      masterGainRef.current.connect(audioContextRef.current.destination);
      
      // Schumann y Solfeggio usan rampa
      const useRamp = profile.id === 'schumann' || profile.id?.includes('solfeggio');
      
      if (useRamp) {
        await createBinauralBeatWithRamp(carrierFreq, beatFreq);
        setDisplayFreq(beatFreq * 1.2); // Frecuencia inicial de la rampa
        setIsRamping(true);
      } else {
        await createBinauralBeat(carrierFreq, beatFreq);
        setDisplayFreq(beatFreq);
        setIsRamping(false);
      }
      
      await loadNatureSound(profile.natureSound || 'stream');
      
      setIsPlaying(true);
      startTimeRef.current = Date.now();
      startTimer(duration);
      
    } catch (err) {
      console.error('Error:', err);
      setError(err.message);
    }
  };

  const createBinauralBeatWithRamp = async (carrierFreq, targetBeatFreq) => {
    if (!audioContextRef.current) return;

    const ctx = audioContextRef.current;
    
    const startBeatFreq = targetBeatFreq * 1.2;
    const rampDuration = 15;
    
    console.log('🌊 Rampa binaural:', {
      beatInicio: startBeatFreq.toFixed(2),
      beatObjetivo: targetBeatFreq,
      carrier: carrierFreq,
      duracion: rampDuration
    });

    const startLeft = carrierFreq - startBeatFreq / 2;
    const startRight = carrierFreq + startBeatFreq / 2;
    const targetLeft = carrierFreq - targetBeatFreq / 2;
    const targetRight = carrierFreq + targetBeatFreq / 2;

    // Oscilador izquierdo
    const oscLeft = ctx.createOscillator();
    const gainLeft = ctx.createGain();
    oscLeft.frequency.value = startLeft;
    oscLeft.type = 'sine';
    oscLeft.frequency.exponentialRampToValueAtTime(
      targetLeft,
      ctx.currentTime + rampDuration
    );
    gainLeft.gain.value = volume.beats;
    oscLeft.connect(gainLeft);
    gainLeft.connect(masterGainRef.current);
    oscLeft.start();

    // Oscilador derecho
    const oscRight = ctx.createOscillator();
    const gainRight = ctx.createGain();
    oscRight.frequency.value = startRight;
    oscRight.type = 'sine';
    oscRight.frequency.exponentialRampToValueAtTime(
      targetRight,
      ctx.currentTime + rampDuration
    );
    gainRight.gain.value = volume.beats;
    oscRight.connect(gainRight);
    gainRight.connect(masterGainRef.current);
    oscRight.start();

    oscillatorsRef.current = [oscLeft, oscRight];
    gainNodesRef.current = { left: gainLeft, right: gainRight, master: masterGainRef.current };

    // Actualizar display durante la rampa
    let currentBeat = startBeatFreq;
    const rampStartTime = Date.now();
    
    freqRampRef.current = setInterval(() => {
      const elapsed = (Date.now() - rampStartTime) / 1000;
      const progress = Math.min(elapsed / rampDuration, 1);
      
      // Interpolación exponencial suave
      currentBeat = startBeatFreq * Math.pow(targetBeatFreq / startBeatFreq, progress);
      
      setDisplayFreq(currentBeat);
      
      // Cuando completa la rampa
      if (progress >= 0.99) {
        setDisplayFreq(targetBeatFreq);
        setIsRamping(false);
        if (freqRampRef.current) {
          clearInterval(freqRampRef.current);
          freqRampRef.current = null;
        }
        console.log('✅ Rampa completada:', targetBeatFreq, 'Hz');
      }
    }, 100);
  };

  const createBinauralBeat = async (carrierFreq, beatFreq) => {
    if (!audioContextRef.current) return;

    const ctx = audioContextRef.current;
    const leftFreq = carrierFreq - beatFreq / 2;
    const rightFreq = carrierFreq + beatFreq / 2;
    
    console.log('🎧 Frecuencias:', { 
      carrier: carrierFreq, 
      beat: beatFreq,
      left: leftFreq, 
      right: rightFreq 
    });

    const oscLeft = ctx.createOscillator();
    const gainLeft = ctx.createGain();
    oscLeft.frequency.value = leftFreq;
    oscLeft.type = 'sine';
    gainLeft.gain.value = volume.beats;
    oscLeft.connect(gainLeft);
    gainLeft.connect(masterGainRef.current);
    oscLeft.start();

    const oscRight = ctx.createOscillator();
    const gainRight = ctx.createGain();
    oscRight.frequency.value = rightFreq;
    oscRight.type = 'sine';
    gainRight.gain.value = volume.beats;
    oscRight.connect(gainRight);
    gainRight.connect(masterGainRef.current);
    oscRight.start();

    oscillatorsRef.current = [oscLeft, oscRight];
    gainNodesRef.current = { left: gainLeft, right: gainRight, master: masterGainRef.current };
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
      console.warn('No se cargó sonido:', err);
    }
  };

  const togglePlayPause = () => {
    if (isPlaying) {
      console.log('⏸ Pausando...');
      
      if (masterGainRef.current) {
        masterGainRef.current.gain.setValueAtTime(0, audioContextRef.current.currentTime);
      }
      
      if (natureAudioRef.current) {
        natureAudioRef.current.pause();
        pausedTimeRef.current = natureAudioRef.current.currentTime;
      }
      
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      
      setIsPlaying(false);
      
    } else {
      console.log('▶ Reproduciendo...');
      
      if (masterGainRef.current && audioContextRef.current) {
        masterGainRef.current.gain.setValueAtTime(1, audioContextRef.current.currentTime);
      }
      
      if (natureAudioRef.current) {
        natureAudioRef.current.currentTime = pausedTimeRef.current;
        natureAudioRef.current.play();
      }
      
      resumeTimer();
      setIsPlaying(true);
    }
  };

  const startTimer = (durationMinutes) => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    
    const durationSeconds = durationMinutes * 60;
    startTimeRef.current = Date.now() - (pausedTimeRef.current * 1000);
    
    intervalRef.current = setInterval(() => {
      const elapsed = (Date.now() - startTimeRef.current) / 1000;
      const remaining = Math.max(0, durationSeconds - elapsed);
      
      setCurrentTime(elapsed);
      
      if (remaining <= 0) handleComplete();
    }, 1000);
  };

  const resumeTimer = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    
    const durationSeconds = (routine?.duration || 20) * 60;
    startTimeRef.current = Date.now() - (currentTime * 1000);
    
    intervalRef.current = setInterval(() => {
      const elapsed = (Date.now() - startTimeRef.current) / 1000;
      const remaining = Math.max(0, durationSeconds - elapsed);
      
      setCurrentTime(elapsed);
      
      if (remaining <= 0) handleComplete();
    }, 1000);
  };

  const handleComplete = () => {
    cleanup();
    onComplete?.();
  };

  const cleanup = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (freqRampRef.current) {
      clearInterval(freqRampRef.current);
      freqRampRef.current = null;
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
    masterGainRef.current = null;
    setIsPlaying(false);
    setIsRamping(false);
  };

  const handleVolumeChange = (type, value) => {
    const validatedValue = validateNumber(value, 0.5, 0, 1);
    setVolume(prev => ({ ...prev, [type]: validatedValue }));
    
    if (type === 'beats' && gainNodesRef.current) {
      if (gainNodesRef.current.left) gainNodesRef.current.left.gain.value = validatedValue;
      if (gainNodesRef.current.right) gainNodesRef.current.right.gain.value = validatedValue;
      if (gainNodesRef.current.main) gainNodesRef.current.main.gain.value = validatedValue;
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

  const freqToShow = displayFreq || profile?.defaultBeatFreq || 10;

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
              ? `${profile.carrierFreq} Hz`
              : `${freqToShow.toFixed(2)} Hz`
            }
          </span>
          <span className="freq-type">{profile?.brainwave || 'Alpha'}</span>
          {isRamping && (
            <span className="freq-ramp-indicator">🌊 Bajando suavemente...</span>
          )}
        </div>
        <div className="freq-box">
          <span className="freq-label">Sonido</span>
          <span className="freq-value">{profile?.natureSound || 'Arroyo'}</span>
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
        <button className="control-btn pause" onClick={togglePlayPause}>
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
