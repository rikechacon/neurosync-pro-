import { HEALING_FREQUENCIES } from '../components/Questionnaire/questions';
import { NATURE_SOUNDS, SESSION_DURATION } from '../constants/frequencies';

export function mapAnswersToRoutine(answers) {
  const { goal, nature_preference, duration } = answers;

  // Obtener información de la frecuencia
  const freqInfo = HEALING_FREQUENCIES[goal];
  
  let routineData;

  // Verificar categoría por el valor
  const isSolfeggio = goal?.includes('solfeggio');
  const isSchumann = goal?.includes('schumann');
  const isBrainwaves = ['relax', 'focus', 'sleep', 'energy', 'meditation'].includes(goal);
  const isTherapeutic = ['immune_boost', 'inflammation', 'organs_harmony', 'circulation'].includes(goal);
  const isNeurological = goal === 'gamma_40hz';

  if (isSolfeggio || isTherapeutic) {
    // FRECUENCIAS TERAPÉUTICAS/SOLFEGGIO - Tono puro
    routineData = {
      id: `healing_${Date.now()}`,
      isHealing: true,
      name: getGoalName(goal),
      icon: getGoalIcon(goal),
      carrierFreq: 0,  // No se usa para tonos puros
      beatFreq: freqInfo?.frequency || 528,
      band: freqInfo?.band || 'solfeggio',
    };
  } else if (isSchumann) {
    // SCHUMANN - Beats binaurales con carrier bajo
    routineData = {
      id: `schumann_${Date.now()}`,
      isHealing: false,
      isSchumann: true,
      name: getGoalName(goal),
      icon: '🌍',
      carrierFreq: 200,
      beatFreq: freqInfo?.frequency || 7.83,
      band: 'schumann'
    };
  } else if (isBrainwaves) {
    // BRAINWAVES - Beats binaurales estándar
    routineData = {
      id: `routine_${Date.now()}`,
      isHealing: false,
      name: getGoalName(goal),
      icon: getGoalIcon(goal),
      carrierFreq: 400,
      beatFreq: freqInfo?.frequency || 6,
      band: freqInfo?.band || 'theta'
    };
  } else if (isNeurological) {
    // NEUROLÓGICAS - Gamma beats
    routineData = {
      id: `neuro_${Date.now()}`,
      isHealing: false,
      name: getGoalName(goal),
      icon: '🧠',
      carrierFreq: 400,
      beatFreq: 40,
      band: 'gamma'
    };
  } else {
    // FALLBACK - Relax por defecto
    routineData = {
      id: `routine_${Date.now()}`,
      isHealing: false,
      name: 'Sesión Personalizada',
      icon: '🎧',
      carrierFreq: 400,
      beatFreq: 6,
      band: 'theta'
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

function getGoalName(goal) {
  const names = {
    relax: 'Relajación Profunda',
    focus: 'Concentración Máxima',
    sleep: 'Sueño Profundo',
    energy: 'Energía Mental',
    meditation: 'Meditación Profunda',
    schumann_pure: 'Schumann Puro',
    schumann_harmonic_1: 'Schumann 1er Armónico',
    schumann_harmonic_2: 'Schumann 2do Armónico',
    solfeggio_174: 'Anestésico Natural',
    solfeggio_396: 'Liberar Culpa y Miedo',
    solfeggio_417: 'Facilitar Cambios',
    solfeggio_528: 'Transformación y Milagros',
    solfeggio_639: 'Conexión y Relaciones',
    solfeggio_741: 'Expresión e Intuición',
    solfeggio_852: 'Despertar Intuición',
    solfeggio_963: 'Conexión Divina',
    gamma_40hz: 'Estimulación Cognitiva',
    immune_boost: 'Fortalecer Inmunidad',
    inflammation: 'Reducir Inflamación',
    organs_harmony: 'Armonización de Órganos',
    circulation: 'Mejorar Circulación'
  };
  return names[goal] || 'Sesión Personalizada';
}

function getGoalIcon(goal) {
  const icons = {
    relax: '🧘',
    focus: '🎯',
    sleep: '😴',
    energy: '⚡',
    meditation: '🧘‍♂️',
    solfeggio_174: '💊',
    solfeggio_396: '🎵',
    solfeggio_417: '🎵',
    solfeggio_528: '✨',
    solfeggio_639: '🎵',
    solfeggio_741: '🎵',
    solfeggio_852: '🎵',
    solfeggio_963: '🌟',
    gamma_40hz: '🧠',
    immune_boost: '🛡️',
    inflammation: '🔥',
    organs_harmony: '🍃',
    circulation: '❤️'
  };
  return icons[goal] || '🎧';
}
