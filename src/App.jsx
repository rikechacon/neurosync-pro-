import { useState, useEffect } from 'react';
import Questionnaire from './components/Questionnaire/Questionnaire';
import AudioPlayer from './components/AudioPlayer/AudioPlayer';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import { authAPI, routinesAPI } from './services/api';
import { checkBluetoothSupport } from './utils/bluetoothCheck';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [currentView, setCurrentView] = useState('home');
  const [currentRoutine, setCurrentRoutine] = useState(null);
  const [btStatus, setBtStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = authAPI.getCurrentUser();
    if (savedUser) {
      setUser(savedUser);
    }
    checkBluetoothSupport().then(setBtStatus);
    setLoading(false);
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    setCurrentView('home');
  };

  const handleRegister = (userData) => {
    setUser(userData);
    setCurrentView('home');
  };

  const handleLogout = () => {
    authAPI.logout();
    setUser(null);
    setCurrentView('home');
  };

  const handleStartQuestionnaire = () => {
    setCurrentView('questionnaire');
  };

  const handleQuestionnaireComplete = async (routine) => {
    console.log('📋 Rutina generada:', routine);
    setCurrentRoutine(routine);
    
    // Guardar rutina en backend si hay usuario
    if (user) {
      try {
        // Asegurar que beat_freq tenga valor
        const routineToSave = {
          ...routine,
          beatFreq: routine.beatFreq || 6, // Valor por defecto si es null
          carrierFreq: routine.carrierFreq || 400,
          name: routine.name || 'Rutina Personalizada'
        };
        
        console.log('💾 Guardando rutina:', routineToSave);
        await routinesAPI.create(routineToSave);
        console.log('✅ Rutina guardada en base de datos');
      } catch (error) {
        console.error('❌ Error guardando rutina:', error);
        // No bloquear el flujo si falla el guardado
      }
    }
    
    setCurrentView('playing');
  };

  const handleBackToHome = () => {
    setCurrentView('home');
    setCurrentRoutine(null);
  };

  const handleSessionComplete = async () => {
    if (user && currentRoutine) {
      try {
        console.log('✅ Sesión completada registrada');
      } catch (error) {
        console.error('Error registrando sesión:', error);
      }
    }
    setCurrentView('home');
    setCurrentRoutine(null);
  };

  if (loading) {
    return <div className="loading">Cargando...</div>;
  }

  if (!user) {
    return (
      <AuthView 
        onLogin={handleLogin}
        onRegister={handleRegister}
      />
    );
  }

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
          
          <div className="header-actions">
            <span className="user-greeting">👋 {user.name || user.email}</span>
            <button onClick={handleLogout} className="logout-button">
              Cerrar Sesión
            </button>
          </div>
          
          <div className="status-indicators">
            {btStatus && (
              <span className={`status-badge ${btStatus.supported ? 'success' : 'warning'}`}>
                {btStatus.supported ? '📡 Bluetooth OK' : '📡 Bluetooth limitado'}
              </span>
            )}
          </div>
        </div>
      </header>

      <main className="app-main">
        {currentView === 'home' && (
          <HomeView 
            onStart={handleStartQuestionnaire}
            user={user}
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

function AuthView({ onLogin, onRegister }) {
  const [isLogin, setIsLogin] = useState(true);

  return isLogin ? (
    <Login 
      onLogin={onLogin}
      onSwitchToRegister={() => setIsLogin(false)}
    />
  ) : (
    <Register 
      onRegister={onRegister}
      onSwitchToLogin={() => setIsLogin(true)}
    />
  );
}

function HomeView({ onStart, user, btStatus }) {
  return (
    <div className="home-view">
      <div className="welcome-card">
        <h2>Bienvenido{user.name ? `, ${user.name}` : ''} a NeuroSync Pro</h2>
        <p>
          Experimenta la sincronización cerebral mediante sonidos binaurales 
          personalizados y frecuencias terapéuticas.
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

      <button className="start-btn" onClick={onStart}>
        🎯 Comenzar Mi Sesión Personalizada
      </button>

      {btStatus && !btStatus.supported && (
        <div className="notice-card warning">
          <p>⚠️ {btStatus.message}</p>
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

export default App;
