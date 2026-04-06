/**
 * Questions Configuration - v3.0 (FRECUENCIAS CONSOLIDADAS)
 * Todas las frecuencias en rango seguro: 40-963 Hz
 * Sin duplicados - cada frecuencia = única con múltiples beneficios
 */

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
      // ============================================
      // BRAINWAVES - RELAJACIÓN Y ENFOQUE
      // ============================================
      { 
        value: 'relax', 
        label: '🧘 Relajación Profunda (Theta 6 Hz)', 
        description: 'Libera tensión • Calma la mente • Reduce ansiedad', 
        category: 'brainwaves' 
      },
      { 
        value: 'focus', 
        label: '🎯 Concentración Máxima (Alpha 12 Hz)', 
        description: 'Enfoque mental • Claridad • Rendimiento', 
        category: 'brainwaves' 
      },
      { 
        value: 'sleep', 
        label: '😴 Sueño Profundo (Delta 3 Hz)', 
        description: 'Prepara el cuerpo • Descanso reparador', 
        category: 'brainwaves' 
      },
      { 
        value: 'energy', 
        label: '⚡ Energía Mental (Beta 20 Hz)', 
        description: 'Vitalidad • Alerta • Motivación', 
        category: 'brainwaves' 
      },
      { 
        value: 'meditation', 
        label: '🧘‍♂️ Meditación Profunda (Theta 4-7 Hz)', 
        description: 'Conciencia expandida • Paz interior', 
        category: 'brainwaves' 
      },
      
      // ============================================
      // RESONANCIA SCHUMANN
      // ============================================
      { 
        value: 'schumann_pure', 
        label: '🌍 Schumann Puro (7.83 Hz)', 
        description: 'Conexión con la Tierra • Equilibrio natural • Frecuencia fundamental', 
        category: 'schumann', 
        featured: true 
      },
      { 
        value: 'schumann_harmonic_1', 
        label: '🌍 Schumann 1er Armónico (14.3 Hz)', 
        description: 'Claridad mental • Energía vital', 
        category: 'schumann' 
      },
      { 
        value: 'schumann_harmonic_2', 
        label: '🌍 Schumann 2do Armónico (20.8 Hz)', 
        description: 'Equilibrio energético • Vitalidad', 
        category: 'schumann' 
      },
      
      // ============================================
      // SOLFEGGIO - FRECUENCIAS SAGRADAS
      // ============================================
      { 
        value: 'solfeggio_174', 
        label: '💊 Anestésico Natural (174 Hz)', 
        description: 'Alivio del dolor • Sueño reparador • Relajación muscular profunda', 
        category: 'solfeggio',
        benefits: ['Reducción del dolor', 'Inducción al sueño', 'Relajación muscular']
      },
      { 
        value: 'solfeggio_396', 
        label: '🎵 Liberar Culpa y Miedo (396 Hz)', 
        description: 'Transforma el dolor • Libera bloqueos • Sanación emocional', 
        category: 'solfeggio' 
      },
      { 
        value: 'solfeggio_417', 
        label: '🎵 Facilitar Cambios (417 Hz)', 
        description: 'Deshace situaciones • Limpia traumas • Abre caminos', 
        category: 'solfeggio' 
      },
      { 
        value: 'solfeggio_528', 
        label: '✨ Transformación y Milagros (528 Hz)', 
        description: 'Reparación ADN • Regeneración celular • Equilibrio total • Sanación profunda', 
        category: 'solfeggio', 
        featured: true,
        benefits: ['Reparación celular', 'Regeneración de piel', 'Equilibrio corporal', 'Transformación']
      },
      { 
        value: 'solfeggio_639', 
        label: '🎵 Conexión y Relaciones (639 Hz)', 
        description: 'Armonía interpersonal • Comunicación • Amor y comprensión', 
        category: 'solfeggio' 
      },
      { 
        value: 'solfeggio_741', 
        label: '🎵 Expresión e Intuición (741 Hz)', 
        description: 'Limpieza tóxica • Expresión auténtica • Solución de problemas', 
        category: 'solfeggio' 
      },
      { 
        value: 'solfeggio_852', 
        label: '🎵 Despertar Intuición (852 Hz)', 
        description: 'Conexión espiritual • Intuición elevada • Conciencia superior', 
        category: 'solfeggio' 
      },
      { 
        value: 'solfeggio_963', 
        label: '🌟 Conexión Divina (963 Hz)', 
        description: 'Frecuencia de la luz • Conexión cósmica • Estado superior', 
        category: 'solfeggio', 
        featured: true 
      },
      
      // ============================================
      // NEUROLÓGICAS - COGNICIÓN Y MEMORIA
      // ============================================
      { 
        value: 'gamma_40hz', 
        label: '🧠 Estimulación Cognitiva (40 Hz)', 
        description: 'Memoria • Aprendizaje • Función cerebral • Apoyo neurológico', 
        category: 'neurological',
        benefits: ['Mejora la memoria', 'Estimulación cognitiva', 'Apoyo en Alzheimer/Demencia']
      },
      
      // ============================================
      // TERAPÉUTICAS - ÓRGANOS Y SISTEMAS
      // ============================================
      { 
        value: 'immune_boost', 
        label: '🛡️ Fortalecer Inmunidad (650 Hz)', 
        description: 'Estimula defensas • Sistema inmunológico fuerte', 
        category: 'therapeutic' 
      },
      { 
        value: 'inflammation', 
        label: '🔥 Reducir Inflamación (727 Hz)', 
        description: 'Apoyo antiinflamatorio • Recuperación tisular', 
        category: 'therapeutic' 
      },
      { 
        value: 'organs_harmony', 
        label: '🍃 Armonización de Órganos (880 Hz)', 
        description: 'Digestión • Respiración • Sistema interno equilibrado', 
        category: 'therapeutic',
        benefits: ['Mejora digestiva', 'Apoyo respiratorio', 'Armonización de órganos internos']
      },
      { 
        value: 'circulation', 
        label: '❤️ Mejorar Circulación (160 Hz)', 
        description: 'Sistema cardiovascular • Flujo sanguíneo • Vitalidad', 
        category: 'therapeutic' 
      }
    ],
    hint: '12 frecuencias únicas con múltiples beneficios terapéuticos',
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

// FRECUENCIAS CONSOLIDADAS - SIN DUPLICADOS
export const HEALING_FREQUENCIES = {
  // Brainwaves
  relax: { frequency: 6, band: 'theta', carrier: 400 },
  focus: { frequency: 12, band: 'alpha', carrier: 400 },
  sleep: { frequency: 3, band: 'delta', carrier: 400 },
  energy: { frequency: 20, band: 'beta', carrier: 400 },
  meditation: { frequency: 5, band: 'theta', carrier: 400 },
  
  // Schumann
  schumann_pure: { frequency: 7.83, band: 'schumann', carrier: 200 },
  schumann_harmonic_1: { frequency: 14.3, band: 'schumann', carrier: 200 },
  schumann_harmonic_2: { frequency: 20.8, band: 'schumann', carrier: 200 },
  
  // Solfeggio
  solfeggio_174: { frequency: 174, band: 'solfeggio', carrier: 0 },
  solfeggio_396: { frequency: 396, band: 'solfeggio', carrier: 0 },
  solfeggio_417: { frequency: 417, band: 'solfeggio', carrier: 0 },
  solfeggio_528: { frequency: 528, band: 'solfeggio', carrier: 0 },
  solfeggio_639: { frequency: 639, band: 'solfeggio', carrier: 0 },
  solfeggio_741: { frequency: 741, band: 'solfeggio', carrier: 0 },
  solfeggio_852: { frequency: 852, band: 'solfeggio', carrier: 0 },
  solfeggio_963: { frequency: 963, band: 'solfeggio', carrier: 0 },
  
  // Neurológicas
  gamma_40hz: { frequency: 40, band: 'gamma', carrier: 400 },
  
  // Terapéuticas
  immune_boost: { frequency: 650, band: 'therapeutic', carrier: 0 },
  inflammation: { frequency: 727, band: 'therapeutic', carrier: 0 },
  organs_harmony: { frequency: 880, band: 'therapeutic', carrier: 0 },
  circulation: { frequency: 160, band: 'therapeutic', carrier: 0 }
};

export const getHealingFrequency = (healingType) => {
  return HEALING_FREQUENCIES[healingType] || null;
};
