/**
 * Protocolo de comunicación con hardware NeuroSync
 * Formato: [HEADER][COMMAND][PAYLOAD_LENGTH][PAYLOAD][CHECKSUM]
 */

export const PROTOCOL = {
  HEADER: 0xAA,
  VERSION: 0x01,
  MAX_PAYLOAD: 256
};

export const COMMANDS = {
  SESSION_START: 0x01,
  SESSION_STOP: 0x02,
  EMERGENCY_STOP: 0x03,
  SET_FREQUENCY: 0x04,
  SET_CURRENT: 0x05,
  SET_MAGNETIC: 0x06,
  SET_ELECTRODE_SEQUENCE: 0x07,
  GET_STATUS: 0x08,
  CALIBRATE: 0x09,
  FIRMWARE_UPDATE: 0x0A
};

/**
 * Codifica comando para enviar al hardware
 */
export function encode(commandType, payload) {
  const commandCode = COMMANDS[commandType];
  if (!commandCode) {
    throw new Error(`Comando desconocido: ${commandType}`);
  }

  const payloadData = JSON.stringify(payload);
  const payloadBytes = new TextEncoder().encode(payloadData);
  
  if (payloadBytes.length > PROTOCOL.MAX_PAYLOAD) {
    throw new Error('Payload demasiado grande');
  }

  // Construir paquete
  const packet = new Uint8Array(5 + payloadBytes.length);
  packet[0] = PROTOCOL.HEADER;
  packet[1] = PROTOCOL.VERSION;
  packet[2] = commandCode;
  packet[3] = payloadBytes.length;
  packet.set(payloadBytes, 4);
  
  // Calcular checksum
  packet[packet.length - 1] = calculateChecksum(packet.slice(0, -1));

  return packet;
}

/**
 * Decodifica respuesta del hardware
 */
export function decode(uint8Array) {
  if (uint8Array[0] !== PROTOCOL.HEADER) {
    throw new Error('Header inválido');
  }

  const checksum = calculateChecksum(uint8Array.slice(0, -1));
  if (checksum !== uint8Array[uint8Array.length - 1]) {
    throw new Error('Checksum inválido');
  }

  const commandCode = uint8Array[2];
  const payloadLength = uint8Array[3];
  const payloadBytes = uint8Array.slice(4, 4 + payloadLength);
  const payloadData = new TextDecoder().decode(payloadBytes);

  const commandType = Object.keys(COMMANDS).find(
    key => COMMANDS[key] === commandCode
  );

  return {
    type: commandType,
    payload: JSON.parse(payloadData),
    timestamp: Date.now()
  };
}

function calculateChecksum(data) {
  let sum = 0;
  for (let byte of data) {
    sum = (sum + byte) & 0xFF;
  }
  return sum;
}

/**
 * Configuración específica para diadema linfática
 */
export function createLymphaticSequenceConfig(sequence) {
  /**
   * Secuencia de electrodos (16 electrodos totales, 8 por lado)
   * 
   * LADO IZQUIERDO:                    LADO DERECHO:
   * [1] Frente izquierda               [9] Frente derecha
   * [2] Sien izquierda                 [10] Sien derecha
   * [3] Temporal izquierda             [11] Temporal derecha
   * [4] Parietal izquierda             [12] Parietal derecha
   * [5] Occipital izquierda            [13] Occipital derecha
   * [6] Mastoides izquierda            [14] Mastoides derecha
   * [7] Cuello superior izquierdo      [15] Cuello superior derecho
   * [8] Cuello medio izquierdo         [16] Cuello medio derecho
   * 
   * Patrón: Secuencial descendente, luego ascendente
   * Velocidad: 2-3 segundos por electrodo
   */
  
  return {
    sequence: sequence || 'descending_ascending',
    electrodePairs: [
      [1, 9],   // Frente (ambos lados)
      [2, 10],  // Sienes
      [3, 11],  // Temporales
      [4, 12],  // Parietales
      [5, 13],  // Occipitales
      [6, 14],  // Mastoides
      [7, 15],  // Cuello superior
      [8, 16]   // Cuello medio
    ],
    dwellTime_ms: 2500,     // Tiempo por electrodo
    rampUp_ms: 500,         // Suavizado de inicio
    rampDown_ms: 500,       // Suavizado de fin
    current_mA: 1.0,        // Corriente por electrodo
    pulseFrequency_Hz: 10   // Frecuencia de pulsación (sincronizada con audio)
  };
}
