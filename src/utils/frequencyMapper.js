import { FREQUENCY_PRESETS, NATURE_SOUNDS, SESSION_DURATION } from '../constants/frequencies';
import { getHealingFrequency } from '../components/Questionnaire/questions';

export function mapAnswersToRoutine(answers) {
  const { goal, nature_preference, duration } = answers;

  // Verificar si es frecuencia de sanación
  const healingInfo = getHealingFrequency(goal);
  const isHealing = !!healingInfo;
  
  let routineData;

  if (isHealing) {
    // SANACIÓN: Usar frecuencia terapéutica directa
    routineData = {
      id: `healing_${Date.now()}`,
      isHealing: true,
      name: getHealingName(goal),
      icon: '💚',
      carrierFreq: 0,  // No se usa para healing
      beatFreq: healingInfo.frequency,  // Frecuencia terapéutica
      band: healingInfo.band,
    };
  } else if (goal.startsWith('schumann')) {
    // SCHUMANN
    const schumannMap = {
      schumann_pure: { freq: 7.83, name: 'Schumann Puro', icon: '🌍' },
      schumann_harmonic_1: { freq: 14.3, name: 'Schumann 1er Armónico', icon: '🌍' },
      schumann_harmonic_2: { freq: 20.8, name: 'Schumann 2do Armónico', icon: '🌍' }
    };
    const s = schumannMap[goal];
    routineData = {
      id: `schumann_${Date.now()}`,
      isHealing: false,
      isSchumann: true,
      name: s.name,
      icon: s.icon,
      carrierFreq: 200,
      beatFreq: s.freq,
      band: s.freq < 8 ? 'theta' : 'alpha'
    };
  } else {
    // RELAJACIÓN - Brainwaves normales
    const preset = FREQUENCY_PRESETS[goal] || FREQUENCY_PRESETS.relax;
    routineData = {
      id: `routine_${Date.now()}`,
      isHealing: false,
      name: preset.name,
      icon: preset.icon,
      carrierFreq: preset.carrier,
      beatFreq: preset.beat,
      band: preset.band
    };
  }

  const natureSound = NATURE_SOUNDS[nature_preference] || NATURE_SOUNDS.none;
  const finalDuration = duration || 900;

  return {
    ...routineData,
    natureSound: natureSound.url,
    natureSoundName: natureSound.name,
    duration: finalDuration,
    durationLabel: `${Math.floor(finalDuration/60)} min`,
    timestamp: new Date().toISOString(),
    answers: { ...answers }
  };
}

function getHealingName(healingType) {
  const names = {
    solfeggio_396: 'Liberar Culpa/Miedo (396 Hz)',
    solfeggio_417: 'Facilitar Cambios (417 Hz)',
    solfeggio_528: 'Transformación (528 Hz)',
    solfeggio_639: 'Conexión/Relaciones (639 Hz)',
    solfeggio_741: 'Expresión/Intuición (741 Hz)',
    solfeggio_852: 'Despertar Intuición (852 Hz)',
    solfeggio_963: 'Conexión Divina (963 Hz)',
    alzheimer_40hz: 'Apoyo Cognitivo (40 Hz)',
    memory_40hz: 'Memoria y Aprendizaje (40 Hz)',
    pain_relief: 'Alivio del Dolor (10000 Hz)',
    balance_528: 'Equilibrio Total (528 Hz)'
  };
  return names[healingType] || 'Sanación';
}
