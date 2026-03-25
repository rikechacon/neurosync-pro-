import { useState, useEffect } from 'react';
import { bluetoothService } from '../../services/bluetoothService';
import { createLymphaticSequenceConfig } from '../../services/hardwareProtocol';
import './LymphaticStimulator.css';

export default function LymphaticStimulator({ frequency_Hz, isEnabled }) {
  const [activeElectrodes, setActiveElectrodes] = useState([]);
  const [sequenceProgress, setSequenceProgress] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  // Mapa visual de electrodos (16 total)
  const electrodeMap = [
    { id: 1, name: 'Frente L', position: 'forehead-left' },
    { id: 2, name: 'Sien L', position: 'temple-left' },
    { id: 3, name: 'Temporal L', position: 'temporal-left' },
    { id: 4, name: 'Parietal L', position: 'parietal-left' },
    { id: 5, name: 'Occipital L', position: 'occipital-left' },
    { id: 6, name: 'Mastoides L', position: 'mastoid-left' },
    { id: 7, name: 'Cuello Sup L', position: 'neck-upper-left' },
    { id: 8, name: 'Cuello Med L', position: 'neck-mid-left' },
    { id: 9, name: 'Frente R', position: 'forehead-right' },
    { id: 10, name: 'Sien R', position: 'temple-right' },
    { id: 11, name: 'Temporal R', position: 'temporal-right' },
    { id: 12, name: 'Parietal R', position: 'parietal-right' },
    { id: 13, name: 'Occipital R', position: 'occipital-right' },
    { id: 14, name: 'Mastoides R', position: 'mastoid-right' },
    { id: 15, name: 'Cuello Sup R', position: 'neck-upper-right' },
    { id: 16, name: 'Cuello Med R', position: 'neck-mid-right' }
  ];

  useEffect(() => {
    let interval;
    
    if (isEnabled && isRunning && frequency_Hz) {
      // Sincronizar secuencia con frecuencia de audio
      const sequenceConfig = createLymphaticSequenceConfig();
      const pairIndex = Math.floor(sequenceProgress / sequenceConfig.electrodePairs.length);
      const currentPair = sequenceConfig.electrodePairs[pairIndex % sequenceConfig.electrodePairs.length];

      setActiveElectrodes(currentPair);

      interval = setInterval(() => {
        setSequenceProgress(prev => (prev + 1) % (sequenceConfig.electrodePairs.length * 2));
      }, sequenceConfig.dwellTime_ms);
    }

    return () => clearInterval(interval);
  }, [isEnabled, isRunning, frequency_Hz, sequenceProgress]);

  const handleStart = async () => {
    const config = createLymphaticSequenceConfig();
    config.pulseFrequency_Hz = frequency_Hz;

    await bluetoothService.sendSessionConfig({
      type: 'LYMPHATIC',
      ...config
    });

    setIsRunning(true);
  };

  const handleStop = async () => {
    await bluetoothService.emergencyStop();
    setIsRunning(false);
    setActiveElectrodes([]);
    setSequenceProgress(0);
  };

  return (
    <div className="lymphatic-stimulator">
      <h3>🔄 Estimulación Linfática</h3>
      
      <div className="head-diagram">
        {electrodeMap.map(electrode => (
          <div
            key={electrode.id}
            className={`electrode ${electrode.position} ${
              activeElectrodes.includes(electrode.id) ? 'active' : ''
            }`}
          >
            <span className="electrode-id">{electrode.id}</span>
            <span className="electrode-name">{electrode.name}</span>
          </div>
        ))}
        
        {/* Líneas de recorrido */}
        <svg className="path-lines">
          <path d="M100,50 L100,200" className="path-left" />
          <path d="M300,50 L300,200" className="path-right" />
          <animate 
            attributeName="stroke-dashoffset"
            from="1000"
            to="0"
            dur={`${1000/frequency_Hz}ms`}
            repeatCount="indefinite"
          />
        </svg>
      </div>

      <div className="controls">
        <div className="frequency-display">
          <span>Frecuencia: {frequency_Hz || '--'} Hz</span>
          <span>Sincronizada con audio</span>
        </div>

        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${(sequenceProgress / 16) * 100}%` }}
          />
        </div>

        {!isRunning ? (
          <button className="start-btn" onClick={handleStart}>
            ▶️ Iniciar Secuencia
          </button>
        ) : (
          <button className="stop-btn" onClick={handleStop}>
            ⏹️ Detener
          </button>
        )}
      </div>

      <div className="safety-info">
        <p>⚠️ Sensación normal: hormigueo suave</p>
        <p>🛑 Detener si: dolor, mareo, náuseas</p>
      </div>
    </div>
  );
}
