const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const pool = require('./config/database');

// Importar rutas
const authRoutes = require('./routes/auth');
const routineRoutes = require('./routes/routines');
const statsRoutes = require('./routes/stats');

// Cargar variables de entorno
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Rutas de API
app.use('/api/auth', authRoutes);
app.use('/api/routines', routineRoutes);
app.use('/api/stats', statsRoutes);

// Health check
app.get('/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ 
      status: 'healthy',
      timestamp: new Date().toISOString(),
      database: 'connected'
    });
  } catch (error) {
    res.status(503).json({ 
      status: 'unhealthy',
      error: error.message 
    });
  }
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    name: 'NeuroSync Pro API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      routines: '/api/routines',
      stats: '/api/stats',
      health: '/health'
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint no encontrado' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    error: 'Error interno del servidor',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════╗
║     🧠 NeuroSync Pro API Server              ║
╠═══════════════════════════════════════════════╣
║  🚀 Server running on port ${PORT}              ║
║  📡 Environment: ${process.env.NODE_ENV || 'development'}                      ║
║  🗄️  Database: ${process.env.DATABASE_URL ? 'Connected' : 'Not configured'}           ║
╚═══════════════════════════════════════════════╝
  `);
});

module.exports = app;
