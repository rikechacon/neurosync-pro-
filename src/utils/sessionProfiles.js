// PERFILES DE SESIÓN CON FRECUENCIAS ESPECÍFICAS

export const PROFILES = {
  // ONDAS CEREBRALES
  delta: {
    id: 'delta',
    name: 'Sueño Profundo',
    category: 'sleep',
    brainwave: 'Delta',
    baseFreq: 2,
    freqRange: [0.5, 4],
    carrierFreq: 200,
    description: 'Regeneración celular, sueño sin sueños',
    natureSound: 'rain',
    recommendedDuration: 30
  },
  
  theta: {
    id: 'theta',
    name: 'Meditación Profunda',
    category: 'meditation',
    brainwave: 'Theta',
    baseFreq: 6,
    freqRange: [4, 8],
    carrierFreq: 250,
    description: 'Meditación profunda, creatividad',
    natureSound: 'ocean',
    recommendedDuration: 20
  },
  
  alpha: {
    id: 'alpha',
    name: 'Relajación Activa',
    category: 'relax',
    brainwave: 'Alpha',
    baseFreq: 10,
    freqRange: [8, 13],
    carrierFreq: 300,
    description: 'Relajación consciente',
    natureSound: 'stream',
    recommendedDuration: 15
  },
  
  alphaFocus: {
    id: 'alphaFocus',
    name: 'Concentración Relajada',
    category: 'focus',
    brainwave: 'Alpha',
    baseFreq: 12,
    freqRange: [10, 13],
    carrierFreq: 350,
    description: 'Enfoque suave',
    natureSound: 'birds',
    recommendedDuration: 25
  },
  
  lowBeta: {
    id: 'lowBeta',
    name: 'Enfoque Activo',
    category: 'focus',
    brainwave: 'Beta Bajo',
    baseFreq: 15,
    freqRange: [13, 18],
    carrierFreq: 400,
    description: 'Concentración activa',
    natureSound: 'stream',
    recommendedDuration: 30
  },
  
  beta: {
    id: 'beta',
    name: 'Energía Mental',
    category: 'energy',
    brainwave: 'Beta',
    baseFreq: 20,
    freqRange: [18, 25],
    carrierFreq: 450,
    description: 'Alerta máxima, energía',
    natureSound: 'birds',
    recommendedDuration: 20
  },
  
  gamma: {
    id: 'gamma',
    name: 'Conciencia Superior',
    category: 'meditation',
    brainwave: 'Gamma',
    baseFreq: 30,
    freqRange: [25, 40],
    carrierFreq: 500,
    description: 'Procesamiento cognitivo superior',
    natureSound: 'ocean',
    recommendedDuration: 15
  },
  
  // FRECUENCIAS SOLFEGGIO
  solfeggio396: {
    id: 'solfeggio396',
    name: 'Liberación de Miedos',
    category: 'healing',
    brainwave: 'Solfeggio 396 Hz',
    baseFreq: 0,
    carrierFreq: 396,
    description: 'Liberación de culpa y miedo',
    natureSound: 'rain',
    recommendedDuration: 20
  },
  
  solfeggio417: {
    id: 'solfeggio417',
    name: 'Cambio y Transformación',
    category: 'healing',
    brainwave: 'Solfeggio 417 Hz',
    baseFreq: 0,
    carrierFreq: 417,
    description: 'Facilita el cambio',
    natureSound: 'stream',
    recommendedDuration: 20
  },
  
  solfeggio528: {
    id: 'solfeggio528',
    name: 'Reparación y Milagros',
    category: 'healing',
    brainwave: 'Solfeggio 528 Hz',
    baseFreq: 0,
    carrierFreq: 528,
    description: 'Transformación y milagros',
    natureSound: 'ocean',
    recommendedDuration: 30
  },
  
  solfeggio639: {
    id: 'solfeggio639',
    name: 'Conexión y Relaciones',
    category: 'healing',
    brainwave: 'Solfeggio 639 Hz',
    baseFreq: 0,
    carrierFreq: 639,
    description: 'Conexión, relaciones',
    natureSound: 'birds',
    recommendedDuration: 20
  },
  
  solfeggio741: {
    id: 'solfeggio741',
    name: 'Expresión y Soluciones',
    category: 'healing',
    brainwave: 'Solfeggio 741 Hz',
    baseFreq: 0,
    carrierFreq: 741,
    description: 'Expresión, claridad',
    natureSound: 'stream',
    recommendedDuration: 20
  },
  
  solfeggio852: {
    id: 'solfeggio852',
    name: 'Intuición Despierta',
    category: 'meditation',
    brainwave: 'Solfeggio 852 Hz',
    baseFreq: 0,
    carrierFreq: 852,
    description: 'Despertar intuición',
    natureSound: 'ocean',
    recommendedDuration: 25
  },
  
  solfeggio963: {
    id: 'solfeggio963',
    name: 'Conexión Divina',
    category: 'meditation',
    brainwave: 'Solfeggio 963 Hz',
    baseFreq: 0,
    carrierFreq: 963,
    description: 'Conexión con la fuente',
    natureSound: 'rain',
    recommendedDuration: 30
  },
  
  schumann: {
    id: 'schumann',
    name: 'Conexión Tierra',
    category: 'healing',
    brainwave: 'Schumann 7.83 Hz',
    baseFreq: 7.83,
    carrierFreq: 200,
    description: 'Resonancia de la Tierra',
    natureSound: 'ocean',
    recommendedDuration: 20
  }
};

// CATEGORÍAS
export const CATEGORIES = {
  relax: {
    id: 'relax',
    name: 'Relajación',
    icon: '🌙',
    profiles: ['alpha', 'theta', 'delta']
  },
  healing: {
    id: 'healing',
    name: 'Sanación',
    icon: '🌸',
    profiles: ['solfeggio396', 'solfeggio417', 'solfeggio528', 'solfeggio639', 'solfeggio741', 'solfeggio852', 'solfeggio963', 'schumann']
  },
  focus: {
    id: 'focus',
    name: 'Concentración',
    icon: '🎯',
    profiles: ['alphaFocus', 'lowBeta']
  },
  energy: {
    id: 'energy',
    name: 'Energía',
    icon: '⚡',
    profiles: ['beta', 'gamma']
  },
  meditation: {
    id: 'meditation',
    name: 'Meditación',
    icon: '🧘',
    profiles: ['theta', 'gamma', 'solfeggio852', 'solfeggio963']
  },
  sleep: {
    id: 'sleep',
    name: 'Sueño Profundo',
    icon: '😴',
    profiles: ['delta', 'theta']
  },
  creativity: {
    id: 'creativity',
    name: 'Creatividad',
    icon: '🎨',
    profiles: ['gamma', 'theta']
  }
};

// Obtener perfil por ID
export const getProfileById = (profileId) => {
  return PROFILES[profileId] || PROFILES.alpha;
};

// Obtener perfil basado en respuestas - CON AJUSTE DE INTENSIDAD
export const getSessionProfile = (answers) => {
  const { goal, intensity } = answers || {};
  
  // Si es Solfeggio, devolver directamente
  if (goal && (goal.startsWith('solfeggio') || goal === 'schumann')) {
    return PROFILES[goal] || PROFILES.alpha;
  }
  
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
  
  // AJUSTAR FRECUENCIA SEGÚN INTENSIDAD
  let adjustedProfile = { ...profile };
  let beatFreqAdjustment = 0;
  
  switch(intensity) {
    case 'gentle':
      // Suave: reducir 2-3 Hz
      beatFreqAdjustment = -2;
      break;
    case 'moderate':
      // Moderada: sin cambio
      beatFreqAdjustment = 0;
      break;
    case 'strong':
      // Intensa: aumentar 2-4 Hz
      beatFreqAdjustment = 3;
      break;
    case 'extreme':
      // Máxima: aumentar 4-6 Hz
      beatFreqAdjustment = 5;
      break;
    default:
      beatFreqAdjustment = 0;
  }
  
  // Aplicar ajuste (solo para beats binaurales, no Solfeggio)
  if (profile.baseFreq > 0) {
    adjustedProfile.defaultBeatFreq = Math.max(
      profile.freqRange[0],
      Math.min(profile.freqRange[1], profile.baseFreq + beatFreqAdjustment)
    );
  } else {
    adjustedProfile.defaultBeatFreq = profile.baseFreq;
  }
  
  console.log('📊 Perfil ajustado:', {
    original: profile.baseFreq,
    intensity,
    adjustment: beatFreqAdjustment,
    final: adjustedProfile.defaultBeatFreq
  });
  
  return adjustedProfile;
};

// Calcular duración
export const calculateOptimalDuration = (profile, answers) => {
  const { time } = answers || {};
  
  if (time) {
    const minutes = parseInt(time);
    return isNaN(minutes) ? 20 : minutes;
  }
  
  return profile.recommendedDuration || 20;
};

export default {
  PROFILES,
  CATEGORIES,
  getProfileById,
  getSessionProfile,
  calculateOptimalDuration
};
