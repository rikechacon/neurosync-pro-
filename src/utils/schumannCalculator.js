import { SCHUMANN_RESONANCE } from '../constants/frequencies';

/**
 * Calcula la frecuencia Schumann óptima según ubicación y hora
 * La resonancia varía ligeramente con actividad solar y ubicación
 */
export class SchumannCalculator {
  constructor() {
    this.baseFrequency = SCHUMANN_RESONANCE.fundamental;
  }

  /**
   * Ajusta frecuencia según hora del día (ritmo circadiano)
   * @param {Date} date - Fecha actual
   * @returns {number} Frecuencia ajustada
   */
  getCircadianAdjusted(date = new Date()) {
    const hour = date.getHours();
    
    // Mañana (6-12): ligeramente más alto para alerta
    if (hour >= 6 && hour < 12) {
      return this.baseFrequency + 0.5;
    }
    // Tarde (12-18): frecuencia base
    if (hour >= 12 && hour < 18) {
      return this.baseFrequency;
    }
    // Noche (18-6): ligeramente más bajo para relajación
    return this.baseFrequency - 0.3;
  }

  /**
   * Selecciona el armónico Schumann según objetivo
   * @param {string} goal - Objetivo del usuario
   * @returns {number} Frecuencia Schumann recomendada
   */
  getHarmonicForGoal(goal) {
    const { harmonics } = SCHUMANN_RESONANCE;
    
    const goalMap = {
      sleep: harmonics[0],      // 14.3 Hz - relajación
      relax: harmonics[0],      // 14.3 Hz
      focus: harmonics[1],      // 20.8 Hz - atención
      energy: harmonics[2],     // 27.3 Hz - energía
      anxiety: harmonics[0],    // 14.3 Hz - calma
      meditation: this.baseFrequency // 7.83 Hz - fundamental
    };

    return goalMap[goal] || this.baseFrequency;
  }

  /**
   * Calcula desviación actual de Schumann (actividad solar)
   * Nota: En producción, esto vendría de una API de monitoreo geomagnético
   */
  getCurrentDeviation() {
    // Simulado - en producción usar API de NOAA o similar
    const baseVariation = Math.sin(Date.now() / 86400000) * 0.2;
    return this.baseFrequency + baseVariation;
  }
}

export const schumannCalc = new SchumannCalculator();
