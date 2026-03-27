import { FREQUENCY_PRESETS, NATURE_SOUNDS, SESSION_DURATION } from '../constants/frequencies';
import { getHealingFrequency } from '../components/Questionnaire/questions';

export function mapAnswersToRoutine(answers) {
  const { 
    stress_level, 
    sleep_quality, 
    goal, 
    healing_type,
    nature_preference, 
    duration 
  } = answers;

  let preset = null;
  let isHealing = false;
  let healingInfo = null;

  // Si es modo sanación
  if (goal === 'healing' && healing_type) {
    isHealing = true;
    healingInfo = getHealingFrequency(healing_type);
    
    if (!healingInfo) {
      console.error('Frecuencia de sanación no encontrada:', healing_type);
      preset = FREQUENCY_PRESETS.relax; // Fallback
    }
  } else {
    // Modo normal
    preset = FREQUENCY_PRESETS[goal] || FREQUENCY_PRESETS.relax;
    
    // Ajustes automáticos basados en estrés
    if (stress_level >= 8 && goal !== 'sleep') {
      preset = FREQUENCY_PRESETS.anxiety;
    }
  }

  // Ajustar duración
  let finalDuration = duration;
  if (!finalDuration) {
    if (stress_level >= 7 || isHealing) finalDuration = SESSION_DURATION.long.seconds;
    else if (stress_level >= 4) finalDuration = SESSION_DURATION.medium.seconds;
    else finalDuration = SESSION_DURATION.short.seconds;
  }

  // Sonido de naturaleza
  const natureSound = NATURE_SOUNDS[nature_preference] || NATURE_SOUNDS.none;

  // Construir rutina
  if (isHealing && healingInfo) {
    return {
      id: `healing_${Date.now()}`,
      isHealing: true,
      healingType: healing_type,
      name: getHealingName(healing_type),
      icon: '💚',
      
      // Frecuencia terapéutica
      carrierFreq: healingInfo.carrier,
      beatFreq: healingInfo.frequency,
      band: healingInfo.band,
      
      // Sonido de fondo
      natureSound: natureSound.url,
      natureSoundName: natureSound.name,
      natureSoundDescription: natureSound.description,
      
      // Duración
      duration: finalDuration,
      durationLabel: Object.values(SESSION_DURATION).find(d => d.seconds === finalDuration)?.label || `${Math.floor(finalDuration/60)} min`,
      
      // Metadatos
      timestamp: new Date().toISOString(),
      answers: { ...answers },
      
      // Beneficios
      benefits: getHealingBenefits(healing_type),
      description: `Frecuencia terapéutica: ${healingInfo.frequency} Hz`,
      
      // Categoría
      category: getCategoryFromHealingType(healing_type)
    };
  }

  // Rutina normal
  return {
    id: `routine_${Date.now()}`,
    isHealing: false,
    presetId: preset.id,
    name: preset.name,
    icon: preset.icon,
    
    carrierFreq: preset.carrier,
    beatFreq: preset.beat,
    band: preset.band,
    
    natureSound: natureSound.url,
    natureSoundName: natureSound.name,
    natureSoundDescription: natureSound.description,
    
    duration: finalDuration,
    durationLabel: Object.values(SESSION_DURATION).find(d => d.seconds === finalDuration)?.label || `${Math.floor(finalDuration/60)} min`,
    
    timestamp: new Date().toISOString(),
    answers: { ...answers },
    
    benefits: preset.benefits,
    description: preset.description
  };
}

function getHealingName(healingType) {
  const names = {
    alzheimer_40hz: 'Apoyo Cognitivo (40 Hz)',
    parkinson_50hz: 'Apoyo Neurológico (50 Hz)',
    memory_40hz: 'Memoria y Aprendizaje (40 Hz)',
    solfeggio_396: 'Liberar Culpa y Miedo (396 Hz)',
    solfeggio_417: 'Facilitar Cambios (417 Hz)',
    solfeggio_528: 'Transformación y Milagros (528 Hz)',
    solfeggio_639: 'Conexión y Relaciones (639 Hz)',
    solfeggio_741: 'Expresión e Intuición (741 Hz)',
    solfeggio_852: 'Despertar Intuición (852 Hz)',
    solfeggio_963: 'Conexión Divina (963 Hz)',
    pain_relief: 'Alivio del Dolor (10000 Hz)',
    inflammation: 'Reducir Inflamación (727 Hz)',
    immune_boost: 'Fortalecer Inmunidad (650 Hz)',
    digestion: 'Mejorar Digestión (880 Hz)',
    circulation: 'Mejorar Circulación (160 Hz)',
    respiratory: 'Apoyo Respiratorio (880 Hz)',
    skin_healing: 'Regeneración de Piel (1170 Hz)',
    deep_sleep_healing: 'Sueño Reparador (174 Hz)',
    balance_528: 'Equilibrio Total (528 Hz)'
  };
  return names[healingType] || 'Sanación';
}

function getHealingBenefits(healingType) {
  const benefits = {
    alzheimer_40hz: ['Estimulación cognitiva', 'Apoyo a la memoria', 'Activación gamma'],
    parkinson_50hz: ['Apoyo al sistema nervioso', 'Estimulación cerebral'],
    memory_40hz: ['Mejora la retención', 'Aumenta concentración', 'Estimula gamma'],
    solfeggio_396: ['Libera culpa y miedo', 'Transforma el dolor', 'Liberación emocional'],
    solfeggio_417: ['Facilita cambios', 'Deshace bloqueos', 'Limpia patrones'],
    solfeggio_528: ['Reparación celular', 'Transformación', 'Frecuencia del amor'],
    solfeggio_639: ['Armoniza relaciones', 'Conexión interpersonal', 'Comprensión'],
    solfeggio_741: ['Limpieza energética', 'Expresión auténtica', 'Intuición'],
    solfeggio_852: ['Despierta intuición', 'Conexión espiritual', 'Conciencia elevada'],
    solfeggio_963: ['Conexión divina', 'Frecuencia de luz', 'Unidad consciousness'],
    pain_relief: ['Alivio natural', 'Reducción del dolor', 'Relajación profunda'],
    inflammation: ['Reduce inflamación', 'Apoyo antiinflamatorio', 'Calma sistémica'],
    immune_boost: ['Fortalece defensas', 'Estimula inmunidad', 'Protección natural'],
    digestion: ['Mejora digestión', 'Armoniza sistema digestivo', 'Alivia malestar'],
    circulation: ['Mejora circulación', 'Apoyo cardiovascular', 'Flujo sanguíneo'],
    respiratory: ['Apoyo pulmonar', 'Mejora respiración', 'Limpia vías respiratorias'],
    skin_healing: ['Regenera piel', 'Rejuvenecimiento', 'Sanación cutánea'],
    deep_sleep_healing: ['Sueño profundo', 'Reparación nocturna', 'Anestesia natural'],
    balance_528: ['Equilibrio total', 'Armonización completa', 'Bienestar integral']
  };
  return benefits[healingType] || ['Sanación y bienestar'];
}

function getCategoryFromHealingType(healingType) {
  if (healingType.includes('solfeggio')) return 'Solfeggio';
  if (healingType.includes('alzheimer') || healingType.includes('parkinson') || healingType.includes('memory')) return 'Neurológico';
  return 'Terapéutico';
}

export function validateAnswers(answers) {
  const requiredFields = ['stress_level', 'sleep_quality', 'goal', 'nature_preference', 'duration'];
  
  const missing = requiredFields.filter(field => {
    const value = answers[field];
    return value === undefined || value === null || value === '';
  });

  if (missing.length > 0) {
    return {
      valid: false,
      message: `Por favor completa: ${missing.map(f => formatFieldName(f)).join(', ')}`
    };
  }

  // Si es healing, requiere healing_type
  if (answers.goal === 'healing' && (!answers.healing_type || answers.healing_type === '')) {
    return { valid: false, message: 'Por favor selecciona el tipo de sanación' };
  }

  if (answers.stress_level < 1 || answers.stress_level > 10) {
    return { valid: false, message: 'Nivel de estrés debe estar entre 1 y 10' };
  }
  
  if (answers.sleep_quality < 1 || answers.sleep_quality > 10) {
    return { valid: false, message: 'Calidad de sueño debe estar entre 1 y 10' };
  }

  return { valid: true };
}

function formatFieldName(field) {
  const labels = {
    stress_level: 'nivel de estrés',
    sleep_quality: 'calidad de sueño',
    goal: 'objetivo principal',
    healing_type: 'tipo de sanación',
    nature_preference: 'sonido de fondo',
    duration: 'duración de la sesión'
  };
  return labels[field] || field;
}

export function getTimeBasedRecommendation() {
  const hour = new Date().getHours();
  
  if (hour >= 6 && hour < 12) {
    return { preset: 'focus', reason: 'Mañana: ideal para concentración' };
  } else if (hour >= 12 && hour < 18) {
    return { preset: 'relax', reason: 'Tarde: buen momento para relajación' };
  } else if (hour >= 18 && hour < 22) {
    return { preset: 'anxiety', reason: 'Noche temprana: reduce tensión del día' };
  } else {
    return { preset: 'sleep', reason: 'Noche: prepara para sueño reparador' };
  }
}
