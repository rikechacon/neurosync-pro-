import { useState, useEffect } from 'react'
import { checkBluetoothSupport } from './utils/bluetoothCheck'

function App() {
  const [btSupport, setBtSupport] = useState(null)
  const [currentUrl, setCurrentUrl] = useState('')

  useEffect(() => {
    checkBluetoothSupport().then(setBtSupport)
    setCurrentUrl(window.location.href)
    
    // Actualizar hora cada segundo
    const timer = setInterval(() => {
      const timeElement = document.getElementById('current-time')
      if (timeElement) {
        timeElement.textContent = new Date().toLocaleTimeString()
      }
    }, 1000)
    
    return () => clearInterval(timer)
  }, [])

  const handleTestInteraction = () => {
    alert('¡Funciona! 🎉')
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      padding: '2rem', 
      fontFamily: 'system-ui, sans-serif',
      background: '#1a1a2e',
      color: '#e8e8e8',
      textAlign: 'center'
    }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>
        🧠 NeuroSync Pro
      </h1>
      <p style={{ opacity: 0.8, marginBottom: '2rem' }}>
        ✅ Servidor activo en Codespaces
      </p>
      
      <div style={{ 
        maxWidth: '400px', 
        margin: '2rem auto', 
        background: '#16213e', 
        padding: '1.5rem', 
        borderRadius: '12px',
        textAlign: 'left'
      }}>
        <p style={{ marginBottom: '0.75rem' }}>
          <strong>📡 Bluetooth:</strong> {
            btSupport?.supported 
              ? '✅ Disponible' 
              : btSupport === null 
                ? '⏳ Verificando...' 
                : '❌ No disponible'
          }
        </p>
        <p style={{ marginBottom: '0.75rem' }}>
          <strong>🌐 URL:</strong> <code style={{ 
            background: 'rgba(255,255,255,0.1)', 
            padding: '0.25rem 0.5rem', 
            borderRadius: '4px',
            fontSize: '0.85rem',
            wordBreak: 'break-all'
          }}>{currentUrl}</code>
        </p>
        <p style={{ marginBottom: '0.75rem' }}>
          <strong>🕐 Hora:</strong> <span id="current-time">
            {new Date().toLocaleTimeString()}
          </span>
        </p>
      </div>
      
      <button 
        onClick={handleTestInteraction}
        style={{
          background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
          color: 'white',
          border: 'none',
          padding: '0.75rem 2rem',
          borderRadius: '8px',
          fontSize: '1rem',
          cursor: 'pointer',
          transition: 'transform 0.2s',
          boxShadow: '0 4px 15px rgba(99, 102, 241, 0.4)'
        }}
        onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
        onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
      >
        Probar Interacción
      </button>
    </div>
  )
}

export default App
