/**
 * Configuración de preguntas del cuestionario de evaluación
 * Basado en escalas validadas (adaptación de PSS-10)
 */

export const questions = [
  {
    id: 'stress_level',
    text: '¿Cómo calificarías tu nivel de estrés actual?',
    type: 'scale',
    min: 1,
    max: 10,
    labels: { 
      1: 'Muy relajado', 
      5: 'Moderado', 
      10: 'Muy estresado' 
    },
    hint: 'Piensa en las últimas 24 horas',
    required: true,
    order: 1
  },
  {
    id: 'sleep_quality',
    text: '¿Cómo ha sido tu calidad de sueño esta semana?',
    type: 'scale',
    min: 1,
    max: 10,
    labels: { 
      1: 'Muy mala', 
      5: 'Regular', 
      10: 'Excelente' 
    },
    hint: 'Considera profundidad y descanso al despertar',
    required: true,
    order: 2
  },
  {
    id: 'goal',
    text: '¿Cuál es tu principal objetivo en esta sesión?',
    type: 'single',
    options: [
      { value: 'relax', label: '🧘 Relajación profunda', description: 'Libera tensión y calma la mente' },
      { value: 'focus', label: '🎯 Concentración', description: 'Mejora el enfoque y la claridad mental' },
      { value: 'sleep', label: '😴 Mejorar sueño', description: 'Prepara tu cuerpo para descansar' },
      { value: 'energy', label: '⚡ Más energía', description: 'Activa tu vitalidad natural' },
      { value: 'anxiety', label: '🕊️ Reducir ansiedad', description: 'Calma pensamientos acelerados' },
      { value: 'meditation', label: '🧘‍♂️ Meditación', description: 'Profundiza tu práctica meditativa' },
      { value: 'schumann_fundamental', label: '🌍 Schumann 7.83Hz', description: 'Conecta con la resonancia terrestre' }
    ],
    hint: 'Elige lo que más necesitas ahora',
    required: true,
    order: 3
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
      { value: 'none', label: '🔇 Sin sonido de fondo', description: 'Solo el beat binaural' }
    ],
    hint: 'Puedes ajustar el volumen después',
    required: true,
    order: 4
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
    hint: 'Más tiempo = mayor efecto de sincronización',
    required: true,
    order: 5
  }
];

// Ordenar preguntas por orden definido
export const getOrderedQuestions = () => {
  return [...questions].sort((a, b) => a.order - b.order);
};

// Validación de respuestas
export const validateAnswers = (answers) => {
  const requiredQuestions = questions.filter(q => q.required);
  
  const missing = requiredQuestions.filter(q => {
    const value = answers[q.id];
    return value === undefined || value === null || value === '';
  });
  
  if (missing.length > 0) {
    return {
      valid: false,
      message: `Por favor responde: ${missing.map(q => q.text.split('?')[0]).join(', ')}?`
    };
  }
  
  return { valid: true };
};

// Progreso del cuestionario
export const getQuestionProgress = (currentQuestionIndex, totalQuestions) => {
  return Math.round(((currentQuestionIndex + 1) / totalQuestions) * 100);
};
