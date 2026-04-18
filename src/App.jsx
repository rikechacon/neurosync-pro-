import { useState, useEffect } from 'react';
import Questionnaire from './components/Questionnaire/Questionnaire';
import AudioPlayer from './components/AudioPlayer/AudioPlayer';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Paywall from './components/Paywall/Paywall';
import { authAPI, routinesAPI } from './services/api';
import { checkBluetoothSupport } from './utils/bluetoothCheck';
import { getSessionProfile, calculateOptimalDuration, CATEGORIES } from './utils/sessionProfiles';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [currentView, setCurrentView] = useState('home');
  const [currentRoutine, setCurrentRoutine] = useState(null);
  const [btStatus, setBtStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sessionProfile, setSessionProfile] = useState(null);
  const [showPaywall, setShowPaywall] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    const savedUser = authAPI.getCurrentUser();
    if (savedUser) setUser(savedUser);
    checkBluetoothSupport().then(setBtStatus);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (user && currentView === 'playing') {
      checkSessionLimits();
    }
  }, [currentView, user]);

  const checkSessionLimits = () => {
    const sessions = JSON.parse(localStorage.getItem('completed_sessions') || '[]');
    const sessionsUsed = sessions.length;
    const MAX_FREE = 3;

    const trialData = localStorage.getItem(`trial_${user?.email}`);
    let trialActive = false;
    if (trialData) {
      const { activated, expiresAt } = JSON.parse(trialData);
      if (activated && new Date() < new Date(expiresAt)) {
        trialActive = true;
      }
    }

    if (sessionsUsed >= MAX_FREE && !trialActive) {
      setShowPaywall(true);
    }
  };

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

  const handleStartQuestionnaire = (category = null) => {
    setSelectedCategory(category);
    setCurrentView('questionnaire');
  };

  const handleQuestionnaireComplete = async (routine) => {
    const answers = routine.answers || {};
    const profile = getSessionProfile(answers);
    const optimalDuration = calculateOptimalDuration(profile, answers);
    
    const enhancedRoutine = {
      ...routine,
      duration: optimalDuration,
      profile: profile.id,
      profileName: profile.name
    };
    
    setCurrentRoutine(enhancedRoutine);
    setSessionProfile(profile);
    
    if (user) {
      try {
        await routinesAPI.create({
          ...enhancedRoutine,
          beatFreq: routine.beatFreq || profile.defaultBeatFreq || 10,
          carrierFreq: routine.carrierFreq || profile.carrierFreq || 300,
          name: routine.name || `Sesión ${new Date().toLocaleDateString()}`
        });
      } catch (error) {
        console.error('Error guardando rutina:', error);
      }
    }
    
    setCurrentView('playing');
  };

  const handleSessionComplete = async () => {
    if (user) {
      try {
        const sessions = JSON.parse(localStorage.getItem('completed_sessions') || '[]');
        sessions.push({
          routineId: currentRoutine?.id,
          completedAt: new Date().toISOString(),
          duration: currentRoutine?.duration
        });
        localStorage.setItem('completed_sessions', JSON.stringify(sessions));
        console.log('✅ Sesión completada');
      } catch (error) {
        console.error('Error:', error);
      }
    }
    setCurrentView('home');
    setCurrentRoutine(null);
    setSessionProfile(null);
    setSelectedCategory(null);
  };

  const handleBackToHome = () => {
    setCurrentView('home');
    setCurrentRoutine(null);
    setSessionProfile(null);
    setSelectedCategory(null);
  };

  const handleSubscribe = () => {
    setShowPaywall(false);
  };

  if (loading) return <div className="loading">Cargando...</div>;

  if (!user) {
    return (
      <AuthView onLogin={handleLogin} onRegister={handleRegister} />
    );
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <h1 className="app-title" onClick={handleBackToHome} style={{ cursor: currentView !== 'home' ? 'pointer' : 'default' }}>
            🧠 NeuroSync Pro
          </h1>
          <p className="app-subtitle">Estimulación neurosensorial personalizada con IA</p>
          
          <div className="header-actions">
            <span className="user-greeting">👋 {user.name || user.email}</span>
            <button onClick={handleLogout} className="logout-button">Cerrar Sesión</button>
          </div>
          
          <div className="status-indicators">
            {btStatus && (
              <span className={`status-badge ${btStatus.supported ? 'success' : 'warning'}`}>
                {btStatus.supported ? '📡 Bluetooth OK' : '📡 Bluetooth limitado'}
              </span>
            )}
            {sessionProfile && (
              <span className="status-badge info">🧠 {sessionProfile.name}</span>
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
            selectedCategory={selectedCategory}
          />
        )}
        
        {currentView === 'questionnaire' && (
          <Questionnaire 
            onComplete={handleQuestionnaireComplete} 
            onBack={handleBackToHome}
            selectedCategory={selectedCategory}
          />
        )}
        
        {currentView === 'playing' && currentRoutine && (
          <>
            <AudioPlayer 
              routine={currentRoutine}
              profile={sessionProfile}
              onComplete={handleSessionComplete}
              onBack={handleBackToHome}
            />
            {showPaywall && (
              <Paywall 
                user={user}
                onSubscribe={handleSubscribe}
                onClose={() => setShowPaywall(false)}
              />
            )}
          </>
        )}
      </main>

      <footer className="app-footer">
        <p>© 2026 NeuroSync Pro • Usa auriculares estéreo para mejor experiencia</p>
        <p className="footer-disclaimer">
          Este producto no es un dispositivo médico. Consulta con un profesional de la salud.
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

// CATEGORÍAS CON SANACIÓN INCLUIDA
const HOME_CATEGORIES = [
  { id: 'relax', icon: '🌙', name: 'Relajación', desc: 'Reduce estrés y ansiedad' },
  { id: 'focus', icon: '🎯', name: 'Concentración', desc: 'Mejora tu enfoque mental' },
  { id: 'sleep', icon: '😴', name: 'Sueño Profundo', desc: 'Duerme mejor y más profundo' },
  { id: 'energy', icon: '⚡', name: 'Energía', desc: 'Aumenta tu vitalidad' },
  { id: 'meditation', icon: '🧘', name: 'Meditación', desc: 'Profundiza tu práctica' },
  { id: 'healing', icon: '🌸', name: 'Sanación', desc: 'Frecuencias Solfeggio terapéuticas' }
];

function HomeView({ onStart, user, btStatus, selectedCategory }) {
  const handleCategoryClick = (category) => {
    onStart(category);
  };

  return (
    <div className="home-view">
      <div className="welcome-card">
        <h2>Bienvenido{user.name ? `, ${user.name}` : ''} a NeuroSync Pro</h2>
        <p>Selecciona una categoría para comenzar tu sesión personalizada</p>
      </div>

      <div className="categories-grid">
        {HOME_CATEGORIES.map((category) => (
          <div 
            key={category.id}
            className="category-card"
            onClick={() => handleCategoryClick(category)}
            style={{ cursor: 'pointer' }}
          >
            <div className="category-icon">{category.icon}</div>
            <h3>{category.name}</h3>
            <p>{category.desc}</p>
            <div className="category-hint">Click para comenzar →</div>
          </div>
        ))}
      </div>

      {btStatus && !btStatus.supported && (
        <div className="notice-card warning">
          <p>⚠️ {btStatus.message}</p>
        </div>
      )}
    </div>
  );
}

export default App;
