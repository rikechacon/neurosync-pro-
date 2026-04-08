import { useState, useEffect } from 'react';
import './Paywall.css';

export default function Paywall({ user, onSubscribe, onClose }) {
  const [sessionsUsed, setSessionsUsed] = useState(0);
  const [trialActive, setTrialActive] = useState(false);
  const [trialExpired, setTrialExpired] = useState(false);
  
  const MAX_FREE_SESSIONS = 3;
  const TRIAL_DAYS = 7;
  const GUMROAD_URL = 'https://riketide3.gumroad.com/l/yaszii';

  useEffect(() => {
    if (!user) return;

    const sessions = JSON.parse(localStorage.getItem('completed_sessions') || '[]');
    setSessionsUsed(sessions.length);

    const trialData = localStorage.getItem(`trial_${user.email}`);
    if (trialData) {
      const { startDate, activated } = JSON.parse(trialData);
      const trialEnd = new Date(startDate);
      trialEnd.setDate(trialEnd.getDate() + TRIAL_DAYS);
      
      if (activated && new Date() > trialEnd) {
        setTrialExpired(true);
        setTrialActive(false);
      } else if (activated) {
        setTrialActive(true);
      }
    }
  }, [user]);

  const canUseFree = sessionsUsed < MAX_FREE_SESSIONS && !trialExpired;

  const handleStartTrial = () => {
    localStorage.setItem(`trial_${user.email}`, JSON.stringify({
      email: user.email,
      startDate: new Date().toISOString(),
      activated: true,
      expiresAt: new Date(Date.now() + TRIAL_DAYS * 24 * 60 * 60 * 1000).toISOString()
    }));
    
    setTrialActive(true);
    onSubscribe?.();
  };

  const handleGumroadCheckout = () => {
    window.open(GUMROAD_URL, '_blank');
  };

  const handleClose = () => {
    onClose?.();
  };

  if (canUseFree && !trialExpired) {
    return null;
  }

  const daysRemaining = trialActive ? 
    Math.ceil((JSON.parse(localStorage.getItem(`trial_${user.email}`))?.expiresAt - new Date()) / (1000 * 60 * 60 * 24)) : 0;

  return (
    <div className="paywall-overlay" onClick={handleClose}>
      <div className="paywall-modal" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={handleClose}>✕</button>
        
        <div className="paywall-header">
          <span className="header-icon">🧠</span>
          <h2>NeuroSync Pro</h2>
        </div>

        {trialExpired ? (
          <div className="trial-expired">
            <h3>⏰ Tu prueba gratuita ha terminado</h3>
            <p>¡Esperamos que hayas disfrutado tu experiencia!</p>
            <p>Obtén acceso ilimitado por solo <strong>$2.99 USD/mes</strong></p>
          </div>
        ) : sessionsUsed >= MAX_FREE_SESSIONS ? (
          <div className="sessions-limit">
            <h3>🎯 Has usado tus {MAX_FREE_SESSIONS} sesiones gratuitas</h3>
            <p>¡Esperamos que hayas disfrutado la experiencia!</p>
            <p>Continúa con una suscripción por solo <strong>$2.99 USD/mes</strong></p>
          </div>
        ) : null}

        <div className="pricing-features">
          <div className="feature">✅ Sesiones ilimitadas</div>
          <div className="feature">✅ 21 frecuencias únicas</div>
          <div className="feature">✅ 7 perfiles inteligentes</div>
          <div className="feature">✅ 5 sonidos de naturaleza</div>
          <div className="feature">✅ Guardar rutinas</div>
          <div className="feature">✅ Sin anuncios</div>
        </div>

        <div className="pricing-options">
          {!trialActive && (
            <button className="btn-trial" onClick={handleStartTrial}>
              🎁 Activar {TRIAL_DAYS} Días Gratis
            </button>
          )}
          
          {trialActive && (
            <div className="trial-active-notice">
              <span className="notice-icon">✅</span>
              <span>Trial activo - {daysRemaining} días restantes</span>
            </div>
          )}
          
          <button className="btn-subscribe" onClick={handleGumroadCheckout}>
            💳 Suscribirse - $2.99/mes
          </button>
        </div>

        <p className="cancel-anytime">
          🔒 Pago seguro con Gumroad • Cancela cuando quieras
        </p>
      </div>
    </div>
  );
}
