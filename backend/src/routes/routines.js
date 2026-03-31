const express = require('express');
const router = express.Router();
const Routine = require('../models/Routine');
const Session = require('../models/Session');
const { authenticateToken } = require('../middleware/auth');

router.use(authenticateToken);

// Crear rutina
router.post('/', async (req, res) => {
  try {
    const routineData = req.body;
    
    console.log('📥 Datos recibidos del frontend:', routineData);
    
    // Mapear datos del frontend al formato de base de datos
    const dbData = {
      name: routineData.name,
      carrier_freq: routineData.carrierFreq || 400,
      beat_freq: routineData.beatFreq || 6,
      band: routineData.band || 'theta',
      nature_sound: routineData.natureSound,
      duration: routineData.duration,
      is_healing: routineData.isHealing || false,
      healing_type: routineData.healingType || routineData.answers?.goal || null,
      is_schumann: routineData.isSchumann || false,
      schumann_mode: routineData.schumannMode || null,
      answers: routineData.answers || {}
    };
    
    console.log('💾 Datos para base de datos:', dbData);
    
    const routine = await Routine.create(req.user.id, dbData);
    
    res.status(201).json({
      message: 'Rutina guardada exitosamente',
      routine
    });
  } catch (error) {
    console.error('❌ Error creando rutina:', error);
    res.status(500).json({ 
      error: 'Error en el servidor',
      details: error.message 
    });
  }
});

// Obtener rutinas del usuario
router.get('/', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const offset = parseInt(req.query.offset) || 0;
    
    const routines = await Routine.findByUser(req.user.id, limit, offset);
    
    res.json({ routines });
  } catch (error) {
    console.error('Error obteniendo rutinas:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

// Obtener rutina específica
router.get('/:id', async (req, res) => {
  try {
    const routine = await Routine.findById(req.params.id, req.user.id);
    
    if (!routine) {
      return res.status(404).json({ error: 'Rutina no encontrada' });
    }
    
    res.json({ routine });
  } catch (error) {
    console.error('Error obteniendo rutina:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

// Eliminar rutina
router.delete('/:id', async (req, res) => {
  try {
    await Routine.delete(req.params.id, req.user.id);
    
    res.json({ message: 'Rutina eliminada exitosamente' });
  } catch (error) {
    console.error('Error eliminando rutina:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

// Registrar sesión completada
router.post('/:id/sessions', async (req, res) => {
  try {
    const sessionData = req.body;
    
    const routine = await Routine.findById(req.params.id, req.user.id);
    if (!routine) {
      return res.status(404).json({ error: 'Rutina no encontrada' });
    }
    
    const session = await Session.create(req.user.id, req.params.id, sessionData);
    
    res.status(201).json({
      message: 'Sesión registrada exitosamente',
      session
    });
  } catch (error) {
    console.error('Error registrando sesión:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

module.exports = router;
