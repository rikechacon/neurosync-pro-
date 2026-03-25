/**
 * Límites de seguridad para estimulación
 * Basado en estándares IEC-60601 y literatura tDCS/tACS
 */

export const SAFETY_LIMITS = {
  // Estimulación eléctrica transcraneal (tACS)
  tACS: {
    maxCurrent_mA: 2.0,           // Máximo absoluto (mA)
    recommendedCurrent_mA: 1.0,   // Recomendado para consumidores
    maxSessionMinutes: 30,
    minSessionIntervalHours: 4,   // Entre sesiones
    electrodeSize_cm2: 25,        // Mínimo tamaño electrodo
    currentDensity_mA_cm2: 0.08   // Máximo densidad de corriente
  },

  // Campos magnéticos (solenoides)
  magnetic: {
    maxField_mT: 10,              // Máximo campo (miliTesla)
    recommendedField_mT: 5,       // Recomendado
    maxSessionMinutes: 45,
    frequencyRange_Hz: [0.5, 50]
  },

  // Contraindicaciones absolutas
  contraindications: [
    'Marcapasos o implantes cardíacos',
    'Historial de epilepsia o convulsiones',
    'Implantes metálicos en cabeza/cuello',
    'Embarazo',
    'Heridas abiertas en zona de aplicación',
    'Menores de 18 años',
    'Conducción de vehículos o maquinaria'
  ],

  // Verificaciones previas a sesión
  preSessionChecks: [
    'Impedancia de electrodos < 10 kΩ',
    'Contacto completo verificado',
    'Temperatura de electrodos normal',
    'Batería suficiente (>20%)',
    'Sin movimiento excesivo detectado'
  ]
};

export const EMERGENCY_STOP = {
  triggerConditions: [
    'Impedancia > 50 kΩ',
    'Corriente > límite configurado',
    'Temperatura > 40°C',
    'Movimiento brusco detectado',
    'Usuario presiona parada emergencia'
  ],
  responseTime_ms: 50  // Máximo tiempo de reacción
};
