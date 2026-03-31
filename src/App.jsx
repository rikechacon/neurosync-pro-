import { useState, useEffect } from 'react';
import Questionnaire from './components/Questionnaire/Questionnaire';
import AudioPlayer from './components/AudioPlayer/AudioPlayer';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import { authAPI, routinesAPI } from './services/api';
import { checkBluetoothSupport } from './utils/bluetoothCheck';
import { getSessionProfile, calculateOptimalDuration, getWelcomeMessage } from './utils/sessionProfiles';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [currentView, setCurrentView] = useState('home');
  const [currentRoutine, setCurrentRoutine] = useState(null);
  const [btStatus, setBtStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sessionProfile, setSessionProfile] = useState(null);

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
    
    // Calcular perfil inteligente basado en respuestas
    const answers = routine.answers || {};
    const profile = getSessionProfile(answers);
    const optimalDuration = calculateOptimalDuration(profile, answers);
    const welcomeMessage = getWelcomeMessage(profile, answers);
    
    console.log(`🧠 Perfil: ${profile.name}`);
    console.log(`⏱️ Duración óptima: ${optimalDuration}s (${Math.floor(optimalDuration/60)} min)`);
    console.log(`💬 ${welcomeMessage}`);
    
    // Actualizar rutina con duración óptima
    const enhancedRoutine = {
      ...routine,
      duration: optimalDuration,
      profile: profile.id,
      profileName: profile.name
    };
    
    setCurrentRoutine(enhancedRoutine);
    setSessionProfile(profile);
    
    // Guardar rutina en backend si hay usuario
    if (user) {
      try {
        const routineToSave = {
          ...enhancedRoutine,
          beatFreq: routine.beatFreq || 6,
          carrierFreq: routine.carrierFreq || 400,
          name: routine.name || 'Rutina Personalizada'
        };
        
        console.log('💾 Guardando rutina:', routineToSave);
        await routinesAPI.create(routineToSave);
        console.log('✅ Rutina guardada en base de datos');
      } catch (error) {
        console.error('❌ Error guardando rutina:', error);
      }
    }
    
    // Mostrar mensaje de bienvenida
    alert(`🧠 ${profile.name}\n\n${welcomeMessage}`);
    
    setCurrentView('playing');
  };

  const handleBackToHome = () => {
    setCurrentView('home');
    setCurrentRoutine(null);
    setSessionProfile(null);
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
    setSessionProfile(null);
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
            Estimulación neurosensorial personalizada con IA
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
            {sessionProfile && (
              <span className="status-badge info">
                🧠 {sessionProfile.name}
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
            profile={sessionProfile}
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
    <Login onLogin={onLogin} onSwitchToRegister={() => setIsLogin(false)} />
  ) : (
    <Register onRegister={onRegister} onSwitchToLogin={() => setIsLogin(true)} />
  );
}

function HomeView({ onStart, user, btStatus }) {
  return (
    <div className="home-view">
      <div className="welcome-card">
        <h2>Bienvenido{user.name ? `, ${user.name}` : ''} a NeuroSync Pro</h2>
        <p>Experimenta la sincronización cerebral con perfiles inteligentes adaptativos.</p>
      </div>
      <div className="features-grid">
        <FeatureCard icon="🎧" title="Beats Binaurales" description="Sincronización de ondas cerebrales" />
        <FeatureCard icon="🌍" title="Frecuencia Schumann" description="Conexión con la Tierra (7.83 Hz)" />
        <FeatureCard icon="🎵" title="Sonidos de Naturaleza" description="Relajación profunda" />
        <FeatureCard icon="🧠" title="Perfiles Inteligentes" description="Adaptación automática según tu estado" />
      </div>
      <button className="start-btn" onClick={onStart}>🎯 Comenzar Mi Sesión Personalizada</button>
      {btStatus && !btStatus.supported && (
        <div className="notice-card warning"><p>⚠️ {btStatus.message}</p></div>
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
