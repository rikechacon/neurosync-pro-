const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const pool = require('./config/database');

const authRoutes = require('./routes/auth');
const routineRoutes = require('./routes/routines');
const statsRoutes = require('./routes/stats');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// CORS PERMISIVO - Allow all origins
app.use(cors({
  origin: '*',  // Allow ALL origins (for development)
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path} - Origin: ${req.get('origin') || 'no-origin'}`);
  next();
});

// Routes
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
      database: 'connected',
      cors: 'enabled (allow all origins)',
      origin: req.get('origin')
    });
  } catch (error) {
    res.status(503).json({ status: 'unhealthy', error: error.message });
  }
});

// Root
app.get('/', (req, res) => {
  res.json({
    name: 'NeuroSync Pro API',
    version: '1.0.0',
    message: 'CORS: Allow all origins',
    endpoints: {
      auth: '/api/auth',
      routines: '/api/routines',
      stats: '/api/stats',
      health: '/health'
    }
  });
});

// 404
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════╗
║  🧠 NeuroSync Pro API                  ║
║  🚀 Port: ${PORT}                       ║
║  🔐 CORS: ALLOW ALL ORIGINS (*)        ║
║  🗄️  DB: ${process.env.DATABASE_URL ? 'Connected' : 'Not set'}  ║
╚════════════════════════════════════════╝
  `);
});

module.exports = app;
