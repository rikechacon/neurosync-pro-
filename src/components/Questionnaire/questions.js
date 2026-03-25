// Basado en escalas validadas (PSS-10 adaptado)
export const questions = [
  {
    id: 'stress_frequency',
    text: '¿Con qué frecuencia te sientes estresado/a?',
    type: 'scale',
    options: [
      { value: 1, label: 'Nunca' },
      { value: 2, label: 'Casi nunca' },
      { value: 3, label: 'A veces' },
      { value: 4, label: 'Frecuentemente' },
      { value: 5, label: 'Muy frecuentemente' }
    ],
    domain: 'emotional'
  },
  {
    id: 'sleep_quality',
    text: '¿Cómo calificarías tu calidad de sueño?',
    type: 'scale',
    options: [
      { value: 1, label: 'Muy mala' },
      { value: 2, label: 'Mala' },
      { value: 3, label: 'Regular' },
      { value: 4, label: 'Buena' },
      { value: 5, label: 'Excelente' }
    ],
    domain: 'sleep'
  },
  {
    id: 'mental_load',
    text: '¿Sientes que tienes demasiadas cosas en tu mente?',
    type: 'scale',
    options: [
      { value: 1, label: 'Nada' },
      { value: 2, label: 'Un poco' },
      { value: 3, label: 'Moderadamente' },
      { value: 4, label: 'Bastante' },
      { value: 5, label: 'Mucho' }
    ],
    domain: 'cognitive'
  },
  {
    id: 'physical_tension',
    text: '¿Experimentas tensión física (hombros, cuello, mandíbula)?',
    type: 'scale',
    options: [
      { value: 1, label: 'Nunca' },
      { value: 2, label: 'Rara vez' },
      { value: 3, label: 'A veces' },
      { value: 4, label: 'Frecuentemente' },
      { value: 5, label: 'Siempre' }
    ],
    domain: 'physical'
  },
  {
    id: 'goal',
    text: '¿Cuál es tu principal objetivo?',
    type: 'single',
    options: [
      { value: 'relax', label: 'Relajación profunda' },
      { value: 'focus', label: 'Concentración' },
      { value: 'sleep', label: 'Mejorar sueño' },
      { value: 'energy', label: 'Más energía' },
      { value: 'anxiety', label: 'Reducir ansiedad' }
    ],
    domain: 'goal'
  },
  {
    id: 'nature_preference',
    text: '¿Qué sonido de fondo prefieres?',
    type: 'single',
    options: [
      { value: 'rain', label: '🌧️ Lluvia ligera' },
      { value: 'ocean', label: '🌊 Olas del mar' },
      { value: 'stream', label: '🏞️ Arroyo' },
      { value: 'birds', label: '🐦 Pájaros' },
      { value: 'crickets', label: '🦗 Grillos y ranas' },
      { value: 'none', label: '🔇 Sin sonido de fondo' }
    ],
    domain: 'preference'
  }
];

export const frequencyMapping = {
  relax: { carrier: 400, beat: 6, band: 'theta' },      // 4-8 Hz
  focus: { carrier: 400, beat: 12, band: 'alpha' },     // 8-14 Hz
  sleep: { carrier: 400, beat: 3, band: 'delta' },      // 0.5-4 Hz
  energy: { carrier: 400, beat: 20, band: 'beta' },     // 14-30 Hz
  anxiety: { carrier: 400, beat: 8, band: 'alpha' }     // 8-14 Hz
};

export const natureSounds = {
  rain: '/sounds/rain.mp3',
  ocean: '/sounds/ocean.mp3',
  stream: '/sounds/stream.mp3',
  birds: '/sounds/birds.mp3',
  crickets: '/sounds/crickets.mp3',
  none: null
};
