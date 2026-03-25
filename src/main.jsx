import React from 'react'
import ReactDOM from 'react-dom/client'

function App() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      padding: '2rem', 
      fontFamily: 'system-ui, sans-serif',
      background: '#1a1a2e',
      color: '#e8e8e8',
      textAlign: 'center'
    }}>
      <h1>🧠 NeuroSync Pro</h1>
      <p style={{ opacity: 0.8 }}>✅ Servidor activo en Codespaces</p>
      
      <div style={{ 
        maxWidth: '400px', 
        margin: '2rem auto', 
        background: '#16213e', 
        padding: '1rem', 
        borderRadius: '12px',
        textAlign: 'left'
      }}>
        <p><strong>📡 Bluetooth:</strong> {
          typeof navigator !== 'undefined' && 'bluetooth' in navigator 
            ? '✅ Disponible' 
            : '❌ No disponible'
        }</p>
        <p><strong>🌐 URL:</strong> <code>window.location.href</code></p>
        <p><strong>🕐 Hora:</strong> {new Date().toLocaleTimeString()}</p>
      </div>
      
      <button 
        onClick={() => alert('¡Funciona! 🎉')}
        style={{
          background: '#6366f1',
          color: 'white',
          border: 'none',
          padding: '0.75rem 2rem',
          borderRadius: '8px',
          fontSize: '1rem',
          cursor: 'pointer'
        }}
      >
        Probar Interacción
      </button>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
