export const questions = [
  {
    id: 'stress_level',
    text: '¿Cómo calificarías tu nivel de estrés actual?',
    type: 'scale',
    min: 1, max: 10,
    labels: { 1: 'Muy relajado', 5: 'Moderado', 10: 'Muy estresado' },
    hint: 'Piensa en las últimas 24 horas',
    required: true, order: 1
  },
  {
    id: 'sleep_quality',
    text: '¿Cómo ha sido tu calidad de sueño esta semana?',
    type: 'scale',
    min: 1, max: 10,
    labels: { 1: 'Muy mala', 5: 'Regular', 10: 'Excelente' },
    hint: 'Considera profundidad y descanso al despertar',
    required: true, order: 2
  },
  {
    id: 'goal',
    text: '¿Cuál es tu principal objetivo en esta sesión?',
    type: 'single',
    options: [
      // RELAJACIÓN - Brainwaves
      { value: 'relax', label: '🧘 Relajación profunda', description: 'Theta - Libera tensión y calma la mente', category: 'relaxation' },
      { value: 'focus', label: '🎯 Concentración', description: 'Alpha - Mejora el enfoque y claridad', category: 'relaxation' },
      { value: 'sleep', label: '😴 Mejorar sueño', description: 'Delta - Prepara tu cuerpo para descansar', category: 'relaxation' },
      { value: 'energy', label: '⚡ Más energía', description: 'Beta - Activa tu vitalidad natural', category: 'relaxation' },
      { value: 'anxiety', label: '🕊️ Reducir ansiedad', description: 'Alpha - Calma pensamientos acelerados', category: 'relaxation' },
      { value: 'meditation', label: '🧘‍♂️ Meditación Profunda', description: 'Theta profundo - Conciencia expandida', category: 'relaxation' },
      
      // SCHUMANN
      { value: 'schumann_pure', label: '🌍 Schumann Puro 7.83Hz', description: 'Conexión fundamental con la Tierra', category: 'schumann', featured: true },
      { value: 'schumann_harmonic_1', label: '🌍 Schumann 14.3Hz', description: 'Claridad mental natural', category: 'schumann' },
      { value: 'schumann_harmonic_2', label: '🌍 Schumann 20.8Hz', description: 'Energía vital equilibrada', category: 'schumann' },
      
      // SANACIÓN - Solfeggio y terapéuticas
      { value: 'solfeggio_396', label: '🎵 Liberar Culpa/Miedo (396 Hz)', description: 'Solfeggio - Transformación del dolor', category: 'healing' },
      { value: 'solfeggio_417', label: '🎵 Facilitar Cambios (417 Hz)', description: 'Solfeggio - Deshacer situaciones', category: 'healing' },
      { value: 'solfeggio_528', label: '🎵 Transformación/Milagros (528 Hz)', description: 'Solfeggio - Reparación ADN', category: 'healing', featured: true },
      { value: 'solfeggio_639', label: '🎵 Conexión/Relaciones (639 Hz)', description: 'Solfeggio - Armonía interpersonal', category: 'healing' },
      { value: 'solfeggio_741', label: '🎵 Expresión/Intuición (741 Hz)', description: 'Solfeggio - Limpieza y solución', category: 'healing' },
      { value: 'solfeggio_852', label: '🎵 Despertar Intuición (852 Hz)', description: 'Solfeggio - Conexión espiritual', category: 'healing' },
      { value: 'solfeggio_963', label: '🎵 Conexión Divina (963 Hz)', description: 'Solfeggio - Frecuencia de la luz', category: 'healing', featured: true },
      { value: 'alzheimer_40hz', label: '🧠 Alzheimer/Demencia (40 Hz)', description: 'Estimulación gamma para memoria', category: 'healing' },
      { value: 'memory_40hz', label: '📚 Memoria y Aprendizaje (40 Hz)', description: 'Mejora la retención', category: 'healing' },
      { value: 'pain_relief', label: '💊 Alivio del Dolor (10000 Hz)', description: 'Frecuencia analgésica natural', category: 'healing' },
      { value: 'balance_528', label: '⚖️ Equilibrio Total (528 Hz)', description: 'Armonización completa', category: 'healing', featured: true }
    ],
    hint: 'Selecciona la frecuencia que deseas experimentar',
    required: true, order: 3
  },
  {
    id: 'nature_preference',
    text: '¿Qué sonido de fondo prefieres?',
    type: 'single',
    options: [
      { value: 'rain', label: '🌧️ Lluvia ligera', description: 'Gotas suaves y constantes' },
      { value: 'ocean', label: '🌊 Olas del mar', description: 'Ritmo relajante del océano' },
      { value: 'stream', label: '🏞️ Arroyo', description: 'Agua fluyendo en naturaleza' },
      { value: 'birds', label: '🐦 Pájaros', description: 'Canto matutino de aves' },
      { value: 'crickets', label: '🦗 Grillos y ranas', description: 'Ambiente nocturno tranquilo' },
      { value: 'none', label: '🔇 Sin sonido de fondo', description: 'Solo la frecuencia pura' }
    ],
    hint: 'Para frecuencias Solfeggio, "Sin sonido" permite mayor enfoque',
    required: true, order: 4
  },
  {
    id: 'duration',
    text: '¿Cuánto tiempo tienes disponible?',
    type: 'single',
    options: [
      { value: 300, label: '5 minutos', description: 'Rápido - Ideal para pausas' },
      { value: 900, label: '15 minutos', description: 'Estándar - Sesión completa' },
      { value: 1800, label: '30 minutos', description: 'Profundo - Máximo beneficio' }
    ],
    hint: 'Solfeggio: 15-30 min recomendados',
    required: true, order: 5
  }
];

export const getOrderedQuestions = () => [...questions].sort((a, b) => a.order - b.order);

export const validateAnswers = (answers) => {
  const requiredQuestions = questions.filter(q => q.required);
  
  const missing = requiredQuestions.filter(q => {
    const value = answers[q.id];
    return value === undefined || value === null || value === '';
  });
  
  if (missing.length > 0) {
    return { valid: false, message: `Por favor responde: ${missing.map(q => q.text.split('?')[0]).join(', ')}?` };
  }
  return { valid: true };
};

export const getQuestionProgress = (currentQuestionIndex, totalQuestions) => {
  return Math.round(((currentQuestionIndex + 1) / totalQuestions) * 100);
};

// Mapeo de frecuencias de sanación
export const HEALING_FREQUENCIES = {
  solfeggio_396: { frequency: 396, band: 'solfeggio' },
  solfeggio_417: { frequency: 417, band: 'solfeggio' },
  solfeggio_528: { frequency: 528, band: 'solfeggio' },
  solfeggio_639: { frequency: 639, band: 'solfeggio' },
  solfeggio_741: { frequency: 741, band: 'solfeggio' },
  solfeggio_852: { frequency: 852, band: 'solfeggio' },
  solfeggio_963: { frequency: 963, band: 'solfeggio' },
  alzheimer_40hz: { frequency: 40, band: 'gamma' },
  memory_40hz: { frequency: 40, band: 'gamma' },
  pain_relief: { frequency: 10000, band: 'therapeutic' },
  balance_528: { frequency: 528, band: 'solfeggio' }
};

export const getHealingFrequency = (healingType) => {
  return HEALING_FREQUENCIES[healingType] || null;
};
