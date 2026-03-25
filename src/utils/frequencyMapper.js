/**
 * Mapea respuestas del cuestionario a rutinas de audio
 */

import { FREQUENCY_PRESETS, NATURE_SOUNDS, SESSION_DURATION } from '../constants/frequencies';

/**
 * Determina la rutina óptima basada en las respuestas del usuario
 */
export function mapAnswersToRoutine(answers) {
  const { 
    stress_level, 
    sleep_quality, 
    goal, 
    nature_preference, 
    duration 
  } = answers;

  // Seleccionar preset base según objetivo principal
  let preset = FREQUENCY_PRESETS[goal] || FREQUENCY_PRESETS.relax;

  // Ajustes automáticos basados en nivel de estrés
  if (stress_level >= 8 && goal !== 'sleep') {
    // Estrés muy alto: priorizar calma
    preset = FREQUENCY_PRESETS.anxiety;
  } else if (stress_level >= 6 && ['energy', 'focus'].includes(goal)) {
    // Estrés alto con objetivo de energía: usar alpha en lugar de beta
    preset = FREQUENCY_PRESETS.relax;
  }

  // Ajustar duración si no se especificó o si el estrés lo requiere
  let finalDuration = duration;
  if (!finalDuration) {
    if (stress_level >= 7) finalDuration = SESSION_DURATION.long.seconds;
    else if (stress_level >= 4) finalDuration = SESSION_DURATION.medium.seconds;
    else finalDuration = SESSION_DURATION.short.seconds;
  }

  // Obtener configuración de sonido de naturaleza
  const natureSound = NATURE_SOUNDS[nature_preference] || NATURE_SOUNDS.none;

  // Construir objeto de rutina
  return {
    id: `routine_${Date.now()}`,
    presetId: preset.id,
    name: preset.name,
    icon: preset.icon,
    
    // Parámetros de audio binaural
    carrierFreq: preset.carrier,
    beatFreq: preset.beat,
    band: preset.band,
    
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
    
    // Beneficios esperados
    benefits: preset.benefits,
    
    // Información para UI
    description: preset.description
  };
}

/**
 * Valida que las respuestas del cuestionario estén completas
 */
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

  // Validar rangos
  if (answers.stress_level < 1 || answers.stress_level > 10) {
    return { valid: false, message: 'Nivel de estrés debe estar entre 1 y 10' };
  }
  
  if (answers.sleep_quality < 1 || answers.sleep_quality > 10) {
    return { valid: false, message: 'Calidad de sueño debe estar entre 1 y 10' };
  }

  return { valid: true };
}

/**
 * Formatea nombres de campos para mensajes de error
 */
function formatFieldName(field) {
  const labels = {
    stress_level: 'nivel de estrés',
    sleep_quality: 'calidad de sueño',
    goal: 'objetivo principal',
    nature_preference: 'sonido de fondo',
    duration: 'duración de la sesión'
  };
  return labels[field] || field;
}

/**
 * Obtiene recomendación basada en hora del día
 */
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
