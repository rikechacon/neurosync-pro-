import { useState, useEffect } from 'react';
import { audioEngine } from '../../services/audioGenerator';
import './AudioPlayer.css';

export default function AudioPlayer({ routine, onComplete }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(routine?.duration || 300);
  const [volume, setVolume] = useState(0.7);

  useEffect(() => {
    let interval;
    if (isPlaying && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            setIsPlaying(false);
            onComplete?.();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, timeRemaining, onComplete]);

  const handlePlay = async () => {
    if (!routine) return;
    
    if (isPlaying) {
      audioEngine.stop();
      setIsPlaying(false);
    } else {
      await audioEngine.playRoutine(routine);
      setIsPlaying(true);
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    audioEngine.setVolume(newVolume);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="audio-player">
      <div className="visualizer">
        <div className={`wave ${isPlaying ? 'active' : ''}`} />
        <div className={`wave ${isPlaying ? 'active' : ''}`} style={{ animationDelay: '0.2s' }} />
        <div className={`wave ${isPlaying ? 'active' : ''}`} style={{ animationDelay: '0.4s' }} />
      </div>

      <div className="session-info">
        <h3>Sesión {routine?.band?.toUpperCase()}</h3>
        <p>Beat: {routine?.beatFreq} Hz | {routine?.natureSound ? 'Con sonido de fondo' : 'Solo beat'}</p>
      </div>

      <div className="timer">{formatTime(timeRemaining)}</div>

      <button className="play-btn" onClick={handlePlay}>
        {isPlaying ? '⏸️ Pausar' : '▶️ Iniciar'}
      </button>

      <div className="volume-control">
        <label>🔊</label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={volume}
          onChange={handleVolumeChange}
        />
      </div>

      <div className="headphone-warning">
        ⚠️ Usa auriculares estéreo para mejor efecto
      </div>
    </div>
  );
}
