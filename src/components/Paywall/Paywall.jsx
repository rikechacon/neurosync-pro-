import './Paywall.css';

export default function Paywall({ user, onClose }) {
  return (
    <div className="paywall-overlay" onClick={onClose}>
      <div className="paywall-modal" onClick={(e) => e.stopPropagation()}>
        <div className="paywall-header">
          <h2>👑 Versión Premium</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <div className="paywall-content" style={{ textAlign: 'center', padding: '20px' }}>
          <h3 style={{ color: '#4CAF50', fontSize: '1.5rem', marginBottom: '15px' }}>
            ¡Felicidades! 🎉
          </h3>
          <p style={{ fontSize: '1.1rem', lineHeight: '1.6', marginBottom: '20px' }}>
            Estás usando <strong>NeuroSync Pro</strong> con todas sus funciones desbloqueadas.
          </p>
          <p style={{ color: '#666', fontSize: '0.95rem', marginBottom: '25px' }}>
            Durante nuestro lanzamiento, la app es 100% gratuita. <br/>
            Pronto agregaremos funciones exclusivas para suscriptores.
          </p>
          
          <button 
            className="btn-subscribe" 
            onClick={onClose}
            style={{ 
              background: '#4CAF50', 
              padding: '12px 24px', 
              fontSize: '1rem',
              borderRadius: '8px',
              border: 'none',
              color: 'white',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            ¡Entendido, seguir explorando! 🚀
          </button>
        </div>
      </div>
    </div>
  );
}
