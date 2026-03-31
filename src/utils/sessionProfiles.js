/**
 * Perfiles Inteligentes de Sesión
 * Ajusta automáticamente: fade in/out, volumen, frecuencia, naturaleza
 * Basado en: nivel de estrés, calidad de sueño, objetivo
 */

export const SESSION_PROFILES = {
  // ============================================
  // PERFIL 1: ESTRÉS MUY ALTO (8-10)
  // ============================================
  HIGH_STRESS_RELAX: {
    id: 'high_stress_relax',
    name: 'Relajación Profunda Progresiva',
    condition: (answers) => answers.stress_level >= 8 && answers.goal !== 'sleep',
    
    // Fade in muy gradual (2 minutos)
    fadeIn: {
      enabled: true,
      duration: 120,  // 2 minutos
      initialVolume: 0.02,
      targetVolume: 0.20
    },
    
    // Fade out suave
    fadeOut: {
      enabled: true,
      duration: 60,  // 1 minuto
      finalVolume: 0.05
    },
    
    // Progresión de frecuencia: Alpha → Theta → Delta
    frequencyRamp: {
      enabled: true,
      stages: [
        { beatFreq: 12, duration: 300, band: 'alpha', label: 'Calma inicial' },
        { beatFreq: 8, duration: 300, band: 'alpha-theta', label: 'Relajación' },
        { beatFreq: 6, duration: 300, band: 'theta', label: 'Relajación profunda' },
        { beatFreq: 4, duration: 300, band: 'theta-delta', label: 'Paz mental' }
      ]
    },
    
    // Volumen de naturaleza más alto para distraer mente acelerada
    natureVolume: {
      initial: 0.70,
      target: 0.60
    },
    
    // Mensaje personalizado
    message: '🌿 Sesión adaptada para estrés elevado. La frecuencia bajará gradualmente.',
    
    // Duración mínima recomendada
    minDuration: 900  // 15 minutos
  },

  // ============================================
  // PERFIL 2: ESTRÉS ALTO (6-7)
  // ============================================
  MODERATE_STRESS_RELAX: {
    id: 'moderate_stress_relax',
    name: 'Relajación Balanceada',
    condition: (answers) => answers.stress_level >= 6 && answers.stress_level < 8 && answers.goal !== 'sleep',
    
    fadeIn: {
      enabled: true,
      duration: 60,  // 1 minuto
      initialVolume: 0.05,
      targetVolume: 0.25
    },
    
    fadeOut: {
      enabled: true,
      duration: 45,
      finalVolume: 0.10
    },
    
    frequencyRamp: {
      enabled: true,
      stages: [
        { beatFreq: 10, duration: 300, band: 'alpha', label: 'Enfoque calmado' },
        { beatFreq: 8, duration: 300, band: 'alpha', label: 'Relajación' },
        { beatFreq: 6, duration: 300, band: 'theta', label: 'Profundidad' }
      ]
    },
    
    natureVolume: {
      initial: 0.60,
      target: 0.55
    },
    
    message: '🍃 Sesión equilibrada para relajación progresiva.',
    minDuration: 600  // 10 minutos
  },

  // ============================================
  // PERFIL 3: SUEÑO DEFICIENTE (1-4)
  // ============================================
  POOR_SLEEP_RECOVERY: {
    id: 'poor_sleep_recovery',
    name: 'Recuperación de Sueño Profundo',
    condition: (answers) => answers.sleep_quality <= 4,
    
    fadeIn: {
      enabled: true,
      duration: 45,
      initialVolume: 0.08,
      targetVolume: 0.25
    },
    
    fadeOut: {
      enabled: true,
      duration: 120,  // 2 minutos - muy suave para no despertar
      finalVolume: 0.02
    },
    
    frequencyRamp: {
      enabled: true,
      stages: [
        { beatFreq: 8, duration: 300, band: 'alpha', label: 'Transición' },
        { beatFreq: 6, duration: 300, band: 'theta', label: 'Relajación' },
        { beatFreq: 4, duration: 400, band: 'theta-delta', label: 'Pre-sueño' },
        { beatFreq: 2, duration: 500, band: 'delta', label: 'Sueño profundo' }
      ]
    },
    
    natureVolume: {
      initial: 0.50,
      target: 0.40
    },
    
    message: '😴 Sesión diseñada para inducir sueño profundo progresivo.',
    minDuration: 1200  // 20 minutos
  },

  // ============================================
  // PERFIL 4: ENERGÍA / CONCENTRACIÓN
  // ============================================
  ENERGY_FOCUS: {
    id: 'energy_focus',
    name: 'Energía y Concentración',
    condition: (answers) => ['focus', 'energy'].includes(answers.goal),
    
    fadeIn: {
      enabled: true,
      duration: 30,  // Rápido - necesitan energía ya
      initialVolume: 0.10,
      targetVolume: 0.30
    },
    
    fadeOut: {
      enabled: false  // No fade out - corte limpio
    },
    
    frequencyRamp: {
      enabled: false,  // Mantener frecuencia estable
      stableBeatFreq: null  // Se define por el goal
    },
    
    natureVolume: {
      initial: 0.40,
      target: 0.35
    },
    
    message: '⚡ Frecuencia estable para máximo enfoque y energía.',
    minDuration: 300  // 5 minutos
  },

  // ============================================
  // PERFIL 5: SANACIÓN / SOLFEGGIO
  // ============================================
  HEALING_THERAPEUTIC: {
    id: 'healing_therapeutic',
    name: 'Sanación Terapéutica',
    condition: (answers) => answers.isHealing || answers.goal?.includes('solfeggio'),
    
    fadeIn: {
      enabled: true,
      duration: 60,
      initialVolume: 0.05,
      targetVolume: 0.20
    },
    
    fadeOut: {
      enabled: true,
      duration: 60,
      finalVolume: 0.05
    },
    
    frequencyRamp: {
      enabled: false,  // Frecuencia terapéutica fija
      stableBeatFreq: null  // Se define por la frecuencia Solfeggio
    },
    
    natureVolume: {
      initial: 0.30,  // Más bajo para enfocarse en la frecuencia
      target: 0.25
    },
    
    message: '💚 Frecuencia terapéutica pura para sanación profunda.',
    minDuration: 900  // 15 minutos
  },

  // ============================================
  // PERFIL 6: SCHUMANN
  // ============================================
  SCHUMANN_GROUNDING: {
    id: 'schumann_grounding',
    name: 'Conexión con la Tierra',
    condition: (answers) => answers.goal?.includes('schumann'),
    
    fadeIn: {
      enabled: true,
      duration: 45,
      initialVolume: 0.08,
      targetVolume: 0.25
    },
    
    fadeOut: {
      enabled: true,
      duration: 45,
      finalVolume: 0.08
    },
    
    frequencyRamp: {
      enabled: false,  // Schumann fijo
      stableBeatFreq: null
    },
    
    natureVolume: {
      initial: 0.50,
      target: 0.45
    },
    
    message: '🌍 Resonancia Schumann para conexión y equilibrio.',
    minDuration: 600  // 10 minutos
  },

  // ============================================
  // PERFIL 7: ESTÁNDAR (fallback)
  // ============================================
  STANDARD: {
    id: 'standard',
    name: 'Sesión Estándar',
    condition: () => true,  // Siempre aplica como fallback
    
    fadeIn: {
      enabled: true,
      duration: 30,
      initialVolume: 0.10,
      targetVolume: 0.25
    },
    
    fadeOut: {
      enabled: true,
      duration: 30,
      finalVolume: 0.10
    },
    
    frequencyRamp: {
      enabled: false,
      stableBeatFreq: null
    },
    
    natureVolume: {
      initial: 0.50,
      target: 0.50
    },
    
    message: '🎧 Sesión personalizada para tu bienestar.',
    minDuration: 300  // 5 minutos
  }
};

/**
 * Obtener perfil basado en las respuestas del usuario
 */
export function getSessionProfile(answers) {
  // Ordenar perfiles por prioridad
  const priorityOrder = [
    'HEALING_THERAPEUTIC',
    'SCHUMANN_GROUNDING',
    'POOR_SLEEP_RECOVERY',
    'HIGH_STRESS_RELAX',
    'MODERATE_STRESS_RELAX',
    'ENERGY_FOCUS',
    'STANDARD'
  ];

  for (const profileKey of priorityOrder) {
    const profile = SESSION_PROFILES[profileKey];
    if (profile.condition(answers)) {
      console.log(`🧠 Perfil seleccionado: ${profile.name}`);
      return { ...profile, answers };
    }
  }

  return { ...SESSION_PROFILES.STANDARD, answers };
}

/**
 * Calcular duración óptima basada en perfil y respuestas
 */
export function calculateOptimalDuration(profile, answers) {
  const { stress_level, sleep_quality, goal } = answers;
  
  // Si el usuario eligió duración, respetarla (mínimo del perfil)
  if (answers.duration) {
    return Math.max(answers.duration, profile.minDuration);
  }
  
  // Calcular duración basada en estrés y sueño
  let baseDuration = profile.minDuration;
  
  if (stress_level >= 8) {
    baseDuration = Math.max(baseDuration, 1200);  // 20 min
  } else if (stress_level >= 6) {
    baseDuration = Math.max(baseDuration, 900);  // 15 min
  }
  
  if (sleep_quality <= 4) {
    baseDuration = Math.max(baseDuration, 1200);  // 20 min
  }
  
  // Objetivos específicos
  if (goal === 'sleep') {
    baseDuration = Math.max(baseDuration, 1800);  // 30 min
  } else if (goal === 'meditation') {
    baseDuration = Math.max(baseDuration, 1200);  // 20 min
  }
  
  return baseDuration;
}

/**
 * Obtener mensaje de bienvenida personalizado
 */
export function getWelcomeMessage(profile, answers) {
  const messages = {
    HIGH_STRESS_RELAX: 'Respira profundo. Comenzaremos suavemente y bajaremos la frecuencia gradualmente.',
    MODERATE_STRESS_RELAX: 'Tómate este tiempo para ti. La sesión te guiará hacia la relajación.',
    POOR_SLEEP_RECOVERY: 'Prepárate para descansar. Las frecuencias te acompañarán hacia el sueño.',
    ENERGY_FOCUS: '¡Vamos a energizar tu mente! Frecuencia estable para máximo rendimiento.',
    HEALING_THERAPEUTIC: 'Frecuencia terapéutica pura. Relájate y permite que la sanación comience.',
    SCHUMANN_GROUNDING: 'Conecta con la resonancia natural de la Tierra. Siente el equilibrio.',
    STANDARD: 'Tu sesión personalizada está lista. Disfruta del momento.'
  };
  
  return messages[profile.id] || messages.STANDARD;
}

export default {
  SESSION_PROFILES,
  getSessionProfile,
  calculateOptimalDuration,
  getWelcomeMessage
};
