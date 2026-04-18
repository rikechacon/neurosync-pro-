// PERFILES DE SESIÓN CON FRECUENCIAS ESPECÍFICAS

export const PROFILES = {
  // ONDAS CEREBRALES
  delta: {
    id: 'delta',
    name: 'Sueño Profundo',
    category: 'relax',
    brainwave: 'Delta',
    freqRange: [0.5, 4],
    defaultBeatFreq: 2,
    carrierFreq: 200,
    description: 'Regeneración celular, sueño sin sueños',
    benefits: ['Sueño reparador', 'Regeneración física', 'Liberación de hormonas'],
    natureSound: 'rain',
    recommendedDuration: 30
  },
  
  theta: {
    id: 'theta',
    name: 'Meditación Profunda',
    category: 'meditation',
    brainwave: 'Theta',
    freqRange: [4, 8],
    defaultBeatFreq: 6,
    carrierFreq: 250,
    description: 'Meditación profunda, creatividad, intuición',
    benefits: ['Creatividad', 'Intuición', 'Relajación profunda'],
    natureSound: 'ocean',
    recommendedDuration: 20
  },
  
  alpha: {
    id: 'alpha',
    name: 'Relajación Activa',
    category: 'relax',
    brainwave: 'Alpha',
    freqRange: [8, 13],
    defaultBeatFreq: 10,
    carrierFreq: 300,
    description: 'Relajación consciente, reducción de estrés',
    benefits: ['Calma mental', 'Reducción de ansiedad', 'Equilibrio emocional'],
    natureSound: 'stream',
    recommendedDuration: 15
  },
  
  alphaFocus: {
    id: 'alphaFocus',
    name: 'Concentración Relajada',
    category: 'focus',
    brainwave: 'Alpha',
    freqRange: [10, 13],
    defaultBeatFreq: 12,
    carrierFreq: 350,
    description: 'Enfoque suave, aprendizaje',
    benefits: ['Concentración', 'Aprendizaje', 'Memoria'],
    natureSound: 'birds',
    recommendedDuration: 25
  },
  
  lowBeta: {
    id: 'lowBeta',
    name: 'Enfoque Activo',
    category: 'focus',
    brainwave: 'Beta Bajo',
    freqRange: [13, 18],
    defaultBeatFreq: 15,
    carrierFreq: 400,
    description: 'Concentración activa, pensamiento lógico',
    benefits: ['Atención sostenida', 'Razonamiento', 'Productividad'],
    natureSound: 'stream',
    recommendedDuration: 30
  },
  
  beta: {
    id: 'beta',
    name: 'Energía Mental',
    category: 'energy',
    brainwave: 'Beta',
    freqRange: [18, 25],
    defaultBeatFreq: 20,
    carrierFreq: 450,
    description: 'Alerta máxima, energía, acción',
    benefits: ['Energía', 'Motivación', 'Acción'],
    natureSound: 'birds',
    recommendedDuration: 20
  },
  
  gamma: {
    id: 'gamma',
    name: 'Conciencia Superior',
    category: 'meditation',
    brainwave: 'Gamma',
    freqRange: [25, 40],
    defaultBeatFreq: 30,
    carrierFreq: 500,
    description: 'Procesamiento cognitivo superior',
    benefits: ['Insights', 'Comprensión profunda', 'Conciencia expandida'],
    natureSound: 'ocean',
    recommendedDuration: 15
  },
  
  // FRECUENCIAS SOLFEGGIO
  solfeggio396: {
    id: 'solfeggio396',
    name: 'Liberación de Miedos',
    category: 'healing',
    brainwave: 'Solfeggio 396 Hz',
    freqRange: [0, 0],
    defaultBeatFreq: 0,
    carrierFreq: 396,
    description: 'Liberación de culpa y miedo',
    benefits: ['Liberar traumas', 'Transformar culpa', 'Sanar miedos'],
    natureSound: 'rain',
    recommendedDuration: 20
  },
  
  solfeggio417: {
    id: 'solfeggio417',
    name: 'Cambio y Transformación',
    category: 'healing',
    brainwave: 'Solfeggio 417 Hz',
    freqRange: [0, 0],
    defaultBeatFreq: 0,
    carrierFreq: 417,
    description: 'Facilita el cambio y deshace situaciones',
    benefits: ['Cambio positivo', 'Romper patrones', 'Nuevos comienzos'],
    natureSound: 'stream',
    recommendedDuration: 20
  },
  
  solfeggio528: {
    id: 'solfeggio528',
    name: 'Reparación y Milagros',
    category: 'healing',
    brainwave: 'Solfeggio 528 Hz',
    freqRange: [0, 0],
    defaultBeatFreq: 0,
    carrierFreq: 528,
    description: 'Transformación y milagros, reparación ADN',
    benefits: ['Sanación profunda', 'Reparación celular', 'Transformación'],
    natureSound: 'ocean',
    recommendedDuration: 30
  },
  
  solfeggio639: {
    id: 'solfeggio639',
    name: 'Conexión y Relaciones',
    category: 'healing',
    brainwave: 'Solfeggio 639 Hz',
    freqRange: [0, 0],
    defaultBeatFreq: 0,
    carrierFreq: 639,
    description: 'Conexión, relaciones armoniosas',
    benefits: ['Armonía relacional', 'Comunicación', 'Amor'],
    natureSound: 'birds',
    recommendedDuration: 20
  },
  
  solfeggio741: {
    id: 'solfeggio741',
    name: 'Expresión y Soluciones',
    category: 'healing',
    brainwave: 'Solfeggio 741 Hz',
    freqRange: [0, 0],
    defaultBeatFreq: 0,
    carrierFreq: 741,
    description: 'Expresión, soluciones, limpieza',
    benefits: ['Claridad mental', 'Expresión creativa', 'Limpieza energética'],
    natureSound: 'stream',
    recommendedDuration: 20
  },
  
  solfeggio852: {
    id: 'solfeggio852',
    name: 'Intuición Despierta',
    category: 'meditation',
    brainwave: 'Solfeggio 852 Hz',
    freqRange: [0, 0],
    defaultBeatFreq: 0,
    carrierFreq: 852,
    description: 'Despertar intuición, volver al orden espiritual',
    benefits: ['Intuición', 'Conciencia espiritual', 'Claridad'],
    natureSound: 'ocean',
    recommendedDuration: 25
  },
  
  solfeggio963: {
    id: 'solfeggio963',
    name: 'Conexión Divina',
    category: 'meditation',
    brainwave: 'Solfeggio 963 Hz',
    freqRange: [0, 0],
    defaultBeatFreq: 0,
    carrierFreq: 963,
    description: 'Conexión con la fuente, frecuencia de los dioses',
    benefits: ['Conexión divina', 'Unidad', 'Iluminación'],
    natureSound: 'rain',
    recommendedDuration: 30
  },
  
  // RESONANCIA SCHUMANN
  schumann: {
    id: 'schumann',
    name: 'Conexión Tierra',
    category: 'healing',
    brainwave: 'Schumann',
    freqRange: [7.83, 7.83],
    defaultBeatFreq: 7.83,
    carrierFreq: 200,
    description: 'Resonancia fundamental de la Tierra',
    benefits: ['Conexión con la Tierra', 'Equilibrio', 'Grounding'],
    natureSound: 'ocean',
    recommendedDuration: 20
  },
  
  schumannHarmonic: {
    id: 'schumannHarmonic',
    name: 'Armónicos Schumann',
    category: 'healing',
    brainwave: 'Schumann Armónico',
    freqRange: [14.3, 14.3],
    defaultBeatFreq: 14.3,
    carrierFreq: 250,
    description: 'Primer armónico de Schumann',
    benefits: ['Equilibrio energético', 'Sincronización', 'Bienestar'],
    natureSound: 'birds',
    recommendedDuration: 20
  }
};

// CATEGORÍAS PRINCIPALES
export const CATEGORIES = {
  relax: {
    id: 'relax',
    name: 'Relajación',
    icon: '🌙',
    description: 'Reduce estrés y ansiedad',
    profiles: ['alpha', 'theta', 'delta']
  },
  healing: {
    id: 'healing',
    name: 'Sanación',
    icon: '🌸',
    description: 'Frecuencias terapéuticas Solfeggio',
    profiles: ['solfeggio396', 'solfeggio417', 'solfeggio528', 'solfeggio639', 'solfeggio741', 'solfeggio852', 'solfeggio963', 'schumann', 'schumannHarmonic']
  },
  focus: {
    id: 'focus',
    name: 'Concentración',
    icon: '🎯',
    description: 'Mejora tu enfoque mental',
    profiles: ['alphaFocus', 'lowBeta']
  },
  energy: {
    id: 'energy',
    name: 'Energía',
    icon: '⚡',
    description: 'Aumenta tu vitalidad',
    profiles: ['beta', 'gamma']
  },
  meditation: {
    id: 'meditation',
    name: 'Meditación',
    icon: '🧘',
    description: 'Profundiza tu práctica',
    profiles: ['theta', 'gamma', 'solfeggio852', 'solfeggio963']
  },
  sleep: {
    id: 'sleep',
    name: 'Sueño Profundo',
    icon: '😴',
    description: 'Duerme mejor y más profundo',
    profiles: ['delta', 'theta']
  }
};

// Función para obtener perfil por ID
export const getProfileById = (profileId) => {
  return PROFILES[profileId] || PROFILES.alpha;
};

// Función para obtener perfiles por categoría
export const getProfilesByCategory = (categoryId) => {
  const category = CATEGORIES[categoryId];
  if (!category) return [];
  
  return category.profiles.map(profileId => PROFILES[profileId]).filter(Boolean);
};

// Función para obtener perfil basado en respuestas del cuestionario
export const getSessionProfile = (answers) => {
  const { goal, mood, intensity } = answers || {};
  
  // Mapeo de objetivos a perfiles
  const goalToProfile = {
    relax: 'alpha',
    focus: 'lowBeta',
    sleep: 'delta',
    energy: 'beta',
    meditation: 'theta',
    creativity: 'gamma',
    healing: 'solfeggio528'
  };
  
  const profileId = goalToProfile[goal] || 'alpha';
  const profile = PROFILES[profileId];
  
  // Ajustar según intensidad
  let adjustedProfile = { ...profile };
  
  if (intensity === 'gentle') {
    adjustedProfile.defaultBeatFreq = Math.max(0.5, profile.defaultBeatFreq - 2);
  } else if (intensity === 'strong' || intensity === 'extreme') {
    adjustedProfile.defaultBeatFreq = Math.min(40, profile.defaultBeatFreq + 4);
  }
  
  return adjustedProfile;
};

// Función para calcular duración óptima
export const calculateOptimalDuration = (profile, answers) => {
  const { time } = answers || {};
  
  // Si el usuario especificó tiempo, usarlo
  if (time) {
    const minutes = parseInt(time);
    return isNaN(minutes) ? 20 : minutes;
  }
  
  // Si no, usar duración recomendada del perfil
  return profile.recommendedDuration || 20;
};

export default {
  PROFILES,
  CATEGORIES,
  getProfileById,
  getProfilesByCategory,
  getSessionProfile,
  calculateOptimalDuration
};
