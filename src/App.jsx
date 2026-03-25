import { useState, useEffect } from 'react';
import Questionnaire from './components/Questionnaire/Questionnaire';
import { checkBluetoothSupport } from './utils/bluetoothCheck';
import './App.css';

function App() {
  const [currentView, setCurrentView] = useState('home'); // home, questionnaire, playing
  const [currentRoutine, setCurrentRoutine] = useState(null);
  const [btStatus, setBtStatus] = useState(null);

  // Verificar soporte Bluetooth al montar
  useEffect(() => {
    checkBluetoothSupport().then(setBtStatus);
  }, []);

  // Handlers de navegación
  const handleStartQuestionnaire = () => {
    setCurrentView('questionnaire');
  };

  const handleQuestionnaireComplete = (routine) => {
    setCurrentRoutine(routine);
    setCurrentView('playing');
  };

  const handleBackToHome = () => {
    setCurrentView('home');
    setCurrentRoutine(null);
  };

  const handleSessionComplete = () => {
    setCurrentView('home');
    setCurrentRoutine(null);
  };

  return (
    <div className="app">
      {/* Header */}
      <header className="app-header">
        <div className="header-content">
          <h1 
            className="app-title" 
            onClick={handleBackToHome}
            style={{ cursor: currentView !== 'home' ? 'pointer' : 'default' }}
          >
            🧠 NeuroSync Pro
          </h1>
          <p className="app-subtitle">
            Estimulación neurosensorial personalizada
          </p>
          
          {/* Status indicators */}
          <div className="status-indicators">
            {btStatus && (
              <span className={`status-badge ${btStatus.supported ? 'success' : 'warning'}`}>
                {btStatus.supported ? '📡 Bluetooth OK' : '📡 Bluetooth limitado'}
              </span>
            )}
            <span className="status-badge info">
              🌐 {window.location.hostname.includes('github.dev') ? 'Codespaces' : 'Local'}
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="app-main">
        {currentView === 'home' && (
          <HomeView 
            onStart={handleStartQuestionnaire}
            btStatus={btStatus}
          />
        )}
        
        {currentView === 'questionnaire' && (
          <Questionnaire 
            onComplete={handleQuestionnaireComplete}
            onBack={handleBackToHome}
          />
        )}
        
        {currentView === 'playing' && currentRoutine && (
          <PlayingView 
            routine={currentRoutine}
            onComplete={handleSessionComplete}
            onBack={handleBackToHome}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="app-footer">
        <p>© 2026 NeuroSync Pro • Usa auriculares estéreo para mejor experiencia</p>
        <p className="footer-disclaimer">
          Este producto no es un dispositivo médico. Consulta con un profesional de la salud si tienes condiciones médicas.
        </p>
      </footer>
    </div>
  );
}

/* Vista Home */
function HomeView({ onStart, btStatus }) {
  return (
    <div className="home-view">
      {/* Welcome Card */}
      <div className="welcome-card">
        <h2>Bienvenido a NeuroSync Pro</h2>
        <p>
          Experimenta la sincronización cerebral mediante sonidos binaurales 
          personalizados y frecuencia Schumann.
        </p>
      </div>

      {/* Features Grid */}
      <div className="features-grid">
        <FeatureCard 
          icon="🎧"
          title="Beats Binaurales"
          description="Sincronización de ondas cerebrales mediante frecuencias precisas"
        />
        <FeatureCard 
          icon="🌍"
          title="Frecuencia Schumann"
          description="Conecta con la resonancia natural de la Tierra (7.83 Hz)"
        />
        <FeatureCard 
          icon="🎵"
          title="Sonidos de Naturaleza"
          description="Relajación profunda con ambientes naturales"
        />
        <FeatureCard 
          icon="📊"
          title="Personalización"
          description="Rutinas adaptadas a tus necesidades específicas"
        />
      </div>

      {/* CTA Button */}
      <button 
        className="start-btn"
        onClick={onStart}
      >
        🎯 Comenzar Mi Sesión Personalizada
      </button>

      {/* How It Works */}
      <div className="info-section">
        <h3>¿Cómo funciona?</h3>
        <ol>
          <li>Responde el cuestionario de evaluación (2 min)</li>
          <li>El sistema genera tu rutina personalizada</li>
          <li>Usa auriculares estéreo para mejor efecto binaural</li>
          <li>Relájate y deja que la tecnología trabaje</li>
        </ol>
      </div>

      {/* Bluetooth Notice */}
      {btStatus && !btStatus.supported && (
        <div className="notice-card warning">
          <p>⚠️ {btStatus.message}</p>
          <p style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}>
            El audio binaural funcionará igual. La conexión Bluetooth es opcional para hardware futuro.
          </p>
        </div>
      )}
    </div>
  );
}

/* Vista Playing (placeholder por ahora) */
function PlayingView({ routine, onComplete, onBack }) {
  return (
    <div className="playing-view">
      <button className="back-btn" onClick={onBack}>← Volver</button>
      
      <div className="routine-summary">
        <h2>{routine.icon} {routine.name}</h2>
        <p className="routine-description">{routine.description}</p>
        
        <div className="routine-details">
          <div className="detail-item">
            <span className="detail-label">Frecuencia:</span>
            <span className="detail-value">{routine.beatFreq} Hz ({routine.band})</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Duración:</span>
            <span className="detail-value">{routine.durationLabel}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Sonido de fondo:</span>
            <span className="detail-value">{routine.natureSoundName}</span>
          </div>
        </div>

        <div className="benefits-list">
          <h4>Beneficios esperados:</h4>
          <ul>
            {routine.benefits.map((benefit, idx) => (
              <li key={idx}>✓ {benefit}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Audio Player Placeholder */}
      <div className="audio-player-placeholder">
        <div className="visualizer">
          <div className="bar" />
          <div className="bar" />
          <div className="bar" />
          <div className="bar" />
          <div className="bar" />
        </div>
        <p>🎧 Reproductor de audio en desarrollo...</p>
        <button className="play-btn-placeholder" onClick={onComplete}>
          ✅ Simular Sesión Completada
        </button>
      </div>
    </div>
  );
}

/* Componente FeatureCard reutilizable */
function FeatureCard({ icon, title, description }) {
  return (
    <div className="feature-card">
      <div className="feature-icon">{icon}</div>
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}

export default App;
