import { useState } from 'react';
import { bluetoothService } from '../../services/bluetoothService';
import { SAFETY_LIMITS } from '../../constants/safety';
import './HeadbandConnector.css';

export default function HeadbandConnector({ onConnect, onDisconnect }) {
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [deviceInfo, setDeviceInfo] = useState(null);
  const [safetyAcknowledged, setSafetyAcknowledged] = useState(false);
  const [showWarnings, setShowWarnings] = useState(true);

  const handleConnect = async () => {
    if (!safetyAcknowledged) {
      alert('Debes aceptar las advertencias de seguridad primero');
      return;
    }

    setIsConnecting(true);
    const result = await bluetoothService.connect();
    setIsConnecting(false);

    if (result.success) {
      setIsConnected(true);
      setDeviceInfo(result);
      onConnect?.(result);
    } else {
      alert(`Error: ${result.error}`);
    }
  };

  const handleDisconnect = async () => {
    await bluetoothService.disconnect();
    setIsConnected(false);
    setDeviceInfo(null);
    onDisconnect?.();
  };

  if (showWarnings) {
    return (
      <div className="safety-warning-modal">
        <h2>⚠️ Advertencias de Seguridad Críticas</h2>
        
        <div className="warning-section">
          <h3>🚫 No usar si tienes:</h3>
          <ul>
            {SAFETY_LIMITS.contraindications.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </div>

        <div className="warning-section">
          <h3>⚡ Límites de Seguridad:</h3>
          <ul>
            <li>Corriente máxima: {SAFETY_LIMITS.tACS.maxCurrent_mA} mA</li>
            <li>Campo magnético máximo: {SAFETY_LIMITS.magnetic.maxField_mT} mT</li>
            <li>Duración máxima sesión: {SAFETY_LIMITS.tACS.maxSessionMinutes} min</li>
          </ul>
        </div>

        <div className="warning-section">
          <h3>📋 Antes de cada sesión:</h3>
          <ul>
            {SAFETY_LIMITS.preSessionChecks.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </div>

        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={safetyAcknowledged}
            onChange={(e) => setSafetyAcknowledged(e.target.checked)}
          />
          He leído y acepto las advertencias. Consultaré con un médico si tengo dudas.
        </label>

        <button 
          className="continue-btn"
          onClick={() => setShowWarnings(false)}
          disabled={!safetyAcknowledged}
        >
          Continuar
        </button>
      </div>
    );
  }

  return (
    <div className="headband-connector">
      <div className="connection-status">
        <div className={`status-indicator ${isConnected ? 'connected' : 'disconnected'}`} />
        <span>{isConnected ? 'Conectado' : 'Desconectado'}</span>
      </div>

      {deviceInfo && (
        <div className="device-info">
          <p>📱 {deviceInfo.deviceName}</p>
          <p>🔋 Batería: {deviceInfo.batteryLevel || 'N/A'}%</p>
        </div>
      )}

      <div className="action-buttons">
        {!isConnected ? (
          <button 
            className="connect-btn"
            onClick={handleConnect}
            disabled={isConnecting}
          >
            {isConnecting ? '🔄 Conectando...' : '🔗 Conectar Diadema'}
          </button>
        ) : (
          <button 
            className="disconnect-btn"
            onClick={handleDisconnect}
          >
            🔌 Desconectar
          </button>
        )}
      </div>

      <div className="hardware-options">
        <label>
          <input type="checkbox" defaultChecked />
          🧲 Diadema Magnética (Solenoides)
        </label>
        <label>
          <input type="checkbox" defaultChecked />
          ⚡ Diadema Linfática (Electrodos)
        </label>
      </div>
    </div>
  );
}
