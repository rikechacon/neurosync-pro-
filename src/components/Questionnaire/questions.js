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
      // Objetivos principales primero
      { value: 'relax', label: '🧘 Relajación profunda', description: 'Libera tensión y calma la mente' },
      { value: 'focus', label: '🎯 Concentración', description: 'Mejora el enfoque y claridad' },
      { value: 'sleep', label: '😴 Mejorar sueño', description: 'Prepara tu cuerpo para descansar' },
      { value: 'energy', label: '⚡ Más energía', description: 'Activa tu vitalidad natural' },
      { value: 'anxiety', label: '🕊️ Reducir ansiedad', description: 'Calma pensamientos acelerados' },
      
      // Sanación (abre sub-pregunta)
      { value: 'healing', label: '💚 Sanación', description: 'Frecuencias terapéuticas específicas', isHealing: true },
      
      // Meditación y Schumann al final
      { value: 'meditation', label: '🧘‍♂️ Meditación Profunda', description: 'Theta profundo para meditación avanzada' },
      { value: 'schumann_pure', label: '🌍 Schumann Puro 7.83Hz', description: 'Conexión fundamental con la Tierra', featured: true },
      { value: 'schumann_harmonic_1', label: '🌍 Schumann 14.3Hz', description: 'Claridad mental natural' },
      { value: 'schumann_harmonic_2', label: '🌍 Schumann 20.8Hz', description: 'Energía vital equilibrada' }
    ],
    hint: 'Selecciona "Sanación" para ver frecuencias terapéuticas específicas',
    required: true, order: 3
  },
  {
    // Pregunta condicional: Solo aparece si selecciona "healing"
    id: 'healing_type',
    text: '¿Qué aspecto deseas apoyar con frecuencias de sanación?',
    type: 'single',
    conditional: {
      showIf: { goal: 'healing' }
    },
    options: [
      // Frecuencias neurológicas/cognitivas
      { value: 'alzheimer_40hz', label: '🧠 Alzheimer/Demencia (40 Hz)', description: 'Estimulación gamma para memoria y cognición', category: 'neurological' },
      { value: 'parkinson_50hz', label: '🧠 Parkinson (50 Hz)', description: 'Frecuencia de apoyo al sistema nervioso', category: 'neurological' },
      { value: 'memory_40hz', label: '📚 Memoria y Aprendizaje (40 Hz)', description: 'Mejora la retención y concentración', category: 'neurological' },
      
      // Frecuencias Solfeggio
      { value: 'solfeggio_396', label: '🎵 Liberar Culpa/Miedo (396 Hz)', description: 'Solfeggio: Transformación del dolor', category: 'solfeggio' },
      { value: 'solfeggio_417', label: '🎵 Facilitar Cambios (417 Hz)', description: 'Solfeggio: Deshacer situaciones', category: 'solfeggio' },
      { value: 'solfeggio_528', label: '🎵 Transformación/Milagros (528 Hz)', description: 'Solfeggio: Reparación ADN', category: 'solfeggio', featured: true },
      { value: 'solfeggio_639', label: '🎵 Conexión/Relaciones (639 Hz)', description: 'Solfeggio: Armonía interpersonal', category: 'solfeggio' },
      { value: 'solfeggio_741', label: '🎵 Expresión/Intuición (741 Hz)', description: 'Solfeggio: Limpieza y solución', category: 'solfeggio' },
      { value: 'solfeggio_852', label: '🎵 Despertar Intuición (852 Hz)', description: 'Solfeggio: Conexión espiritual', category: 'solfeggio' },
      { value: 'solfeggio_963', label: '🎵 Conexión Divina (963 Hz)', description: 'Solfeggio: Frecuencia de la luz', category: 'solfeggio', featured: true },
      
      // Dolor e inflamación
      { value: 'pain_relief', label: '💊 Alivio del Dolor (10000 Hz)', description: 'Frecuencia analgésica natural', category: 'pain' },
      { value: 'inflammation', label: '🔥 Reducir Inflamación (727 Hz)', description: 'Apoyo antiinflamatorio', category: 'pain' },
      
      // Sistema inmunológico
      { value: 'immune_boost', label: '🛡️ Fortalecer Inmunidad (650 Hz)', description: 'Estimulación del sistema inmune', category: 'immune' },
      
      // Digestivo
      { value: 'digestion', label: '🍃 Mejorar Digestión (880 Hz)', description: 'Armonización del sistema digestivo', category: 'digestive' },
      
      // Circulatorio
      { value: 'circulation', label: '❤️ Mejorar Circulación (160 Hz)', description: 'Apoyo al sistema cardiovascular', category: 'circulatory' },
      
      // Respiratorio
      { value: 'respiratory', label: '🫁 Apoyo Respiratorio (880 Hz)', description: 'Frecuencia para pulmones y bronquios', category: 'respiratory' },
      
      // Piel
      { value: 'skin_healing', label: '✨ Regeneración de Piel (1170 Hz)', description: 'Sanación y rejuvenecimiento cutáneo', category: 'skin' },
      
      // Sueño profundo
      { value: 'deep_sleep_healing', label: '😴 Sueño Reparador (174 Hz)', description: 'Frecuencia anestésica natural', category: 'sleep' },
      
      // Equilibrio general
      { value: 'balance_528', label: '⚖️ Equilibrio Total (528 Hz)', description: 'Armonización completa del cuerpo', category: 'balance', featured: true }
    ],
    hint: 'Estas frecuencias están basadas en investigaciones de terapia de frecuencia',
    required: false, // Solo required si goal === 'healing'
    order: 3.5 // Entre pregunta 3 y 4
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
    hint: 'Para frecuencias de sanación, "Sin sonido" permite mayor enfoque',
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
    hint: 'Sanación: 15-30 min recomendados para efectos óptimos',
    required: true, order: 5
  }
];

export const getOrderedQuestions = () => [...questions].sort((a, b) => a.order - b.order);

export const validateAnswers = (answers) => {
  const requiredQuestions = questions.filter(q => q.required);
  
  // Si seleccionó healing, healing_type es requerido
  if (answers.goal === 'healing') {
    if (!answers.healing_type || answers.healing_type === '') {
      return { valid: false, message: 'Por favor selecciona el tipo de sanación deseado' };
    }
  }
  
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
  alzheimer_40hz: { frequency: 40, band: 'gamma', carrier: 400 },
  parkinson_50hz: { frequency: 50, band: 'gamma', carrier: 400 },
  memory_40hz: { frequency: 40, band: 'gamma', carrier: 400 },
  solfeggio_396: { frequency: 396, band: 'solfeggio', carrier: 200 },
  solfeggio_417: { frequency: 417, band: 'solfeggio', carrier: 200 },
  solfeggio_528: { frequency: 528, band: 'solfeggio', carrier: 200 },
  solfeggio_639: { frequency: 639, band: 'solfeggio', carrier: 200 },
  solfeggio_741: { frequency: 741, band: 'solfeggio', carrier: 200 },
  solfeggio_852: { frequency: 852, band: 'solfeggio', carrier: 200 },
  solfeggio_963: { frequency: 963, band: 'solfeggio', carrier: 200 },
  pain_relief: { frequency: 10000, band: 'therapeutic', carrier: 100 },
  inflammation: { frequency: 727, band: 'therapeutic', carrier: 200 },
  immune_boost: { frequency: 650, band: 'therapeutic', carrier: 200 },
  digestion: { frequency: 880, band: 'therapeutic', carrier: 200 },
  circulation: { frequency: 160, band: 'therapeutic', carrier: 300 },
  respiratory: { frequency: 880, band: 'therapeutic', carrier: 200 },
  skin_healing: { frequency: 1170, band: 'therapeutic', carrier: 200 },
  deep_sleep_healing: { frequency: 174, band: 'therapeutic', carrier: 300 },
  balance_528: { frequency: 528, band: 'solfeggio', carrier: 200 }
};

export const getHealingFrequency = (healingType) => {
  return HEALING_FREQUENCIES[healingType] || null;
};
