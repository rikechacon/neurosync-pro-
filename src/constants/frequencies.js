/**
 * Banco de frecuencias para NeuroSync Pro
 * Brainwaves + Schumann Resonance + Presets
 */

export const BRAINWAVE_BANDS = {
  delta: { range: [0.5, 4], purpose: 'Sueño profundo, regeneración celular', color: '#1e3a5f' },
  theta: { range: [4, 8], purpose: 'Relajación, meditación, creatividad', color: '#3b5998' },
  alpha: { range: [8, 14], purpose: 'Calma, enfoque relajado, aprendizaje', color: '#5d8aa8' },
  beta: { range: [14, 30], purpose: 'Concentración, energía, alerta', color: '#87ceeb' },
  gamma: { range: [30, 100], purpose: 'Procesamiento cognitivo superior', color: '#b0e0e6' }
};

export const SCHUMANN_RESONANCE = {
  fundamental: 7.83,
  harmonics: [14.3, 20.8, 27.3, 33.8, 39.5, 45.0],
  description: 'Resonancia electromagnética natural de la Tierra',
  benefits: [
    'Sincronización del ritmo circadiano',
    'Reducción del estrés y ansiedad',
    'Equilibrio del sistema nervioso',
    'Mejora de la calidad del sueño',
    'Conexión con ritmos naturales'
  ]
};

export const FREQUENCY_PRESETS = {
  // === MODO SCHUMANN PURO ===
  schumann_pure: {
    id: 'schumann_pure',
    name: '🌍 Schumann Puro',
    carrier: 200,
    beat: 7.83,
    band: 'theta',
    icon: '🌍',
    description: 'Resonancia fundamental de la Tierra (7.83 Hz) sin modulación',
    benefits: ['Equilibrio natural', 'Sincronización circadiana', 'Conexión tierra'],
    isSchumann: true,
    schumannMode: 'fundamental'
  },
  schumann_harmonic_1: {
    id: 'schumann_harmonic_1',
    name: '🌍 Schumann 1er Armónico',
    carrier: 200,
    beat: 14.3,
    band: 'alpha',
    icon: '🌍',
    description: 'Primer armónico Schumann (14.3 Hz) - Claridad mental',
    benefits: ['Enfoque suave', 'Creatividad', 'Equilibrio emocional'],
    isSchumann: true,
    schumannMode: 'harmonic',
    harmonicOrder: 1
  },
  schumann_harmonic_2: {
    id: 'schumann_harmonic_2',
    name: '🌍 Schumann 2do Armónico',
    carrier: 200,
    beat: 20.8,
    band: 'beta',
    icon: '🌍',
    description: 'Segundo armónico Schumann (20.8 Hz) - Energía natural',
    benefits: ['Vitalidad', 'Concentración', 'Despertar suave'],
    isSchumann: true,
    schumannMode: 'harmonic',
    harmonicOrder: 2
  },
  schumann_harmonic_3: {
    id: 'schumann_harmonic_3',
    name: '🌍 Schumann 3er Armónico',
    carrier: 200,
    beat: 27.3,
    band: 'beta',
    icon: '🌍',
    description: 'Tercer armónico Schumann (27.3 Hz) - Procesamiento cognitivo',
    benefits: ['Agilidad mental', 'Memoria', 'Procesamiento rápido'],
    isSchumann: true,
    schumannMode: 'harmonic',
    harmonicOrder: 3
  },
  schumann_scan: {
    id: 'schumann_scan',
    name: '🌍 Schumann Escaneo',
    carrier: 200,
    beat: 7.83,
    band: 'theta',
    icon: '🔄',
    description: 'Ciclo suave entre fundamental y armónicos Schumann',
    benefits: ['Exploración completa', 'Adaptación natural', 'Equilibrio dinámico'],
    isSchumann: true,
    schumannMode: 'scan',
    scanSequence: [7.83, 14.3, 20.8, 27.3, 20.8, 14.3, 7.83]
  },
  
  // === Brainwave presets estándar ===
  relax: {
    id: 'relax',
    name: '🧘 Relajación Profunda',
    carrier: 400,
    beat: 6,
    band: 'theta',
    icon: '🧘',
    description: 'Theta para relajación profunda y meditación',
    benefits: ['Reducción estrés', 'Calma profunda']
  },
  focus: {
    id: 'focus',
    name: '🎯 Concentración',
    carrier: 400,
    beat: 12,
    band: 'alpha',
    icon: '🎯',
    description: 'Alpha para enfoque relajado y aprendizaje',
    benefits: ['Mejor concentración', 'Memoria']
  },
  sleep: {
    id: 'sleep',
    name: '😴 Sueño Profundo',
    carrier: 400,
    beat: 3,
    band: 'delta',
    icon: '😴',
    description: 'Delta para regeneración nocturna',
    benefits: ['Sueño reparador', 'Regeneración celular']
  },
  energy: {
    id: 'energy',
    name: '⚡ Energía Mental',
    carrier: 400,
    beat: 20,
    band: 'beta',
    icon: '⚡',
    description: 'Beta para energía y alerta mental',
    benefits: ['Vitalidad', 'Despertar natural']
  },
  anxiety: {
    id: 'anxiety',
    name: '🕊️ Calma Anti-Ansiedad',
    carrier: 400,
    beat: 8,
    band: 'alpha',
    icon: '🕊️',
    description: 'Alpha para reducir ansiedad y tensión',
    benefits: ['Calma', 'Estabilidad emocional']
  },
  meditation: {
    id: 'meditation',
    name: '🧘‍♂️ Meditación Profunda',
    carrier: 400,
    beat: 4,
    band: 'theta',
    icon: '🧘‍♂️',
    description: 'Theta profundo para meditación avanzada',
    benefits: ['Conciencia expandida', 'Paz interior']
  }
};

export const NATURE_SOUNDS = {
  rain: { id: 'rain', name: '🌧️ Lluvia', url: '/sounds/rain.mp3', description: 'Sonido relajante de lluvia' },
  ocean: { id: 'ocean', name: '🌊 Olas del Mar', url: '/sounds/ocean.mp3', description: 'Olas rompiendo en la playa' },
  stream: { id: 'stream', name: '🏞️ Arroyo', url: '/sounds/stream.mp3', description: 'Agua fluyendo' },
  birds: { id: 'birds', name: '🐦 Pájaros', url: '/sounds/birds.mp3', description: 'Canto de aves' },
  crickets: { id: 'crickets', name: '🦗 Bosque Nocturno', url: '/sounds/crickets.mp3', description: 'Sonidos nocturnos' },
  none: { id: 'none', name: '🔇 Solo Beat', url: null, description: 'Sin sonido de fondo' }
};

export const SESSION_DURATION = {
  short: { id: 'short', minutes: 5, seconds: 300, label: '5 min - Rápido' },
  medium: { id: 'medium', minutes: 15, seconds: 900, label: '15 min - Estándar' },
  long: { id: 'long', minutes: 30, seconds: 1800, label: '30 min - Profundo' }
};

// Helpers
export const getAllPresets = () => Object.values(FREQUENCY_PRESETS);
export const getPresetById = (id) => FREQUENCY_PRESETS[id] || null;
export const getNatureSounds = () => Object.values(NATURE_SOUNDS);
export const getSchumannPresets = () => Object.values(FREQUENCY_PRESETS).filter(p => p.isSchumann);
export const getBrainwavePresets = () => Object.values(FREQUENCY_PRESETS).filter(p => !p.isSchumann);
