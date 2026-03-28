const express = require('express');
const router = express.Router();
const Session = require('../models/Session');
const { authenticateToken } = require('../middleware/auth');

router.use(authenticateToken);

// Obtener estadísticas generales del usuario
router.get('/summary', async (req, res) => {
  try {
    const stats = await Session.getStats(req.user.id);
    const frequencyStats = await Session.getFrequencyStats(req.user.id);
    
    res.json({
      stats: {
        totalSessions: parseInt(stats.total_sessions) || 0,
        totalTime: parseInt(stats.total_time) || 0,
        avgCompletion: parseFloat(stats.avg_completion) || 0,
        lastSession: stats.last_session
      },
      frequencyStats
    });
  } catch (error) {
    console.error('Error obteniendo estadísticas:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

// Obtener historial de sesiones
router.get('/sessions', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20;
    const offset = parseInt(req.query.offset) || 0;
    
    const sessions = await Session.findByUser(req.user.id, limit, offset);
    
    res.json({ sessions });
  } catch (error) {
    console.error('Error obteniendo sesiones:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

module.exports = router;
