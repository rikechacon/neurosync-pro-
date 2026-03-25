/**
 * Banco completo de frecuencias para NeuroSync Pro
 * Incluye beats binaurales, Schumann y armónicos
 */

export const BRAINWAVE_BANDS = {
  delta: { range: [0.5, 4], purpose: 'Sueño profundo, regeneración' },
  theta: { range: [4, 8], purpose: 'Relajación, meditación, creatividad' },
  alpha: { range: [8, 14], purpose: 'Calma, enfoque relajado' },
  beta: { range: [14, 30], purpose: 'Concentración, energía' },
  gamma: { range: [30, 100], purpose: 'Procesamiento cognitivo alto' }
};

export const SCHUMANN_RESONANCE = {
  fundamental: 7.83,      // Frecuencia base (Hz)
  harmonics: [14.3, 20.8, 27.3, 33.8, 39.5], // Armónicos superiores
  description: 'Resonancia natural de la Tierra',
  benefits: ['Sincronización circadiana', 'Reducción estrés', 'Equilibrio bioeléctrico']
};

export const FREQUENCY_PRESETS = {
  schumann_fundamental: {
    name: 'Schumann Fundamental',
    carrier: 200,
    beat: 7.83,
    band: 'theta',
    icon: '🌍',
    description: 'Resonancia base de la Tierra (7.83 Hz)'
  },
  schumann_harmonic_1: {
    name: 'Schumann 1st Harmonic',
    carrier: 200,
    beat: 14.3,
    band: 'alpha',
    icon: '🌍',
    description: 'Primer armónico Schumann (14.3 Hz)'
  },
  schumann_harmonic_2: {
    name: 'Schumann 2nd Harmonic',
    carrier: 200,
    beat: 20.8,
    band: 'beta',
    icon: '🌍',
    description: 'Segundo armónico Schumann (20.8 Hz)'
  },
  relax: {
    name: 'Relajación Profunda',
    carrier: 400,
    beat: 6,
    band: 'theta',
    icon: '🧘',
    description: 'Theta para relajación profunda'
  },
  focus: {
    name: 'Concentración',
    carrier: 400,
    beat: 12,
    band: 'alpha',
    icon: '🎯',
    description: 'Alpha para enfoque relajado'
  },
  sleep: {
    name: 'Sueño Profundo',
    carrier: 400,
    beat: 3,
    band: 'delta',
    icon: '😴',
    description: 'Delta para regeneración nocturna'
  },
  energy: {
    name: 'Energía Mental',
    carrier: 400,
    beat: 20,
    band: 'beta',
    icon: '⚡',
    description: 'Beta para energía y alerta'
  },
  anxiety: {
    name: 'Calma Anti-Ansiedad',
    carrier: 400,
    beat: 8,
    band: 'alpha',
    icon: '🕊️',
    description: 'Alpha para reducir ansiedad'
  },
  meditation: {
    name: 'Meditación Profunda',
    carrier: 400,
    beat: 4,
    band: 'theta',
    icon: '🧘‍♂️',
    description: 'Theta profundo para meditación'
  }
};

export const HARDWARE_SYNC_FREQ = {
  solenoid_range: [0.5, 50],  // Hz seguros para campos magnéticos
  electrode_range: [1, 30],   // Hz seguros para estimulación eléctrica
  max_current_ma: 2.0,        // Máximo corriente (miliamperios)
  pulse_width_ms: 200         // Ancho de pulso seguro
};
