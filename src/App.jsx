import { useState, useEffect } from 'react';
import Questionnaire from './components/Questionnaire/Questionnaire';
import AudioPlayer from './components/AudioPlayer/AudioPlayer';
import { checkBluetoothSupport } from './utils/bluetoothCheck';
import './App.css';

function App() {
  const [currentView, setCurrentView] = useState('home');
  const [currentRoutine, setCurrentRoutine] = useState(null);
  const [btStatus, setBtStatus] = useState(null);

  useEffect(() => {
    checkBluetoothSupport().then(setBtStatus);
  }, []);

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
          <AudioPlayer 
            routine={currentRoutine}
            onComplete={handleSessionComplete}
            onBack={handleBackToHome}
          />
        )}
      </main>

      <footer className="app-footer">
        <p>© 2026 NeuroSync Pro • Usa auriculares estéreo para mejor experiencia</p>
        <p className="footer-disclaimer">
          Este producto no es un dispositivo médico. Consulta con un profesional de la salud si tienes condiciones médicas.
        </p>
      </footer>
    </div>
  );
}

function HomeView({ onStart, btStatus }) {
  return (
    <div className="home-view">
      <div className="welcome-card">
        <h2>Bienvenido a NeuroSync Pro</h2>
        <p>
          Experimenta la sincronización cerebral mediante sonidos binaurales 
          personalizados y frecuencia Schumann.
        </p>
      </div>

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

      <button 
        className="start-btn"
        onClick={onStart}
      >
        🎯 Comenzar Mi Sesión Personalizada
      </button>

      <div className="info-section">
        <h3>¿Cómo funciona?</h3>
        <ol>
          <li>Responde el cuestionario de evaluación (2 min)</li>
          <li>El sistema genera tu rutina personalizada</li>
          <li>Usa auriculares estéreo para mejor efecto binaural</li>
          <li>Relájate y deja que la tecnología trabaje</li>
        </ol>
      </div>

      {btStatus && !btStatus.supported && (
        <div className="notice-card warning">
          <p>⚠️ {btStatus.message}</p>
          <p style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}>
            El audio binaural funcionará igual. La conexión Bluetooth es opcional.
          </p>
        </div>
      )}
    </div>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="feature-card">
      <div className="feature-icon">{icon}</div>
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}

/* export default App;
