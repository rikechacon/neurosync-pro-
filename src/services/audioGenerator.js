/**
 * Generador de Beats Binaurales con Web Audio API
 * Funciona offline una vez cargado
 */

export class BinauralAudioEngine {
  constructor() {
    this.audioContext = null;
    this.leftOscillator = null;
    this.rightOscillator = null;
    this.leftGain = null;
    this.rightGain = null;
    this.natureSound = null;
    this.isPlaying = false;
    this.masterGain = null;
  }

  async initialize() {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      this.masterGain = this.audioContext.createGain();
      this.masterGain.connect(this.audioContext.destination);
      this.masterGain.gain.value = 0.7; // Volumen seguro
    }
    if (this.audioContext.state === 'suspended') {
      await this.audioContext.resume();
    }
  }

  /**
   * Genera beat binaural personalizado
   * @param {Object} params - Configuración de la rutina
   * @param {number} params.carrierFreq - Frecuencia portadora (ej: 400 Hz)
   * @param {number} params.beatFreq - Frecuencia del beat (ej: 6 Hz para theta)
   * @param {number} params.duration - Duración en segundos
   * @param {string} params.natureSound - URL del sonido de fondo
   */
  async playRoutine(params) {
    await this.initialize();
    this.stop(); // Limpiar sesión anterior

    const { carrierFreq, beatFreq, natureSound, duration } = params;

    // Crear osciladores para cada oído
    this.leftOscillator = this.audioContext.createOscillator();
    this.rightOscillator = this.audioContext.createOscillator();
    this.leftGain = this.audioContext.createGain();
    this.rightGain = this.audioContext.createGain();

    // Configuración binaural
    this.leftOscillator.frequency.value = carrierFreq;
    this.rightOscillator.frequency.value = carrierFreq + beatFreq;
    this.leftOscillator.type = 'sine';
    this.rightOscillator.type = 'sine';

    // Paneo estéreo (izquierda/derecha)
    this.leftGain.gain.value = 0.5;
    this.rightGain.gain.value = 0.5;

    // Conectar nodos
    this.leftOscillator.connect(this.leftGain);
    this.rightOscillator.connect(this.rightGain);
    this.leftGain.connect(this.audioContext.destination);
    this.rightGain.connect(this.audioContext.destination);

    // Iniciar osciladores
    this.leftOscillator.start();
    this.rightOscillator.start();

    // Cargar sonido de naturaleza si existe
    if (natureSound) {
      await this.loadNatureSound(natureSound);
    }

    this.isPlaying = true;

    // Programar parada automática
    if (duration) {
      setTimeout(() => this.stop(), duration * 1000);
    }

    return true;
  }

  async loadNatureSound(url) {
    try {
      const response = await fetch(url);
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);

      this.natureSound = this.audioContext.createBufferSource();
      this.natureSound.buffer = audioBuffer;
      this.natureSound.loop = true;

      const natureGain = this.audioContext.createGain();
      natureGain.gain.value = 0.3; // Volumen más bajo que el beat

      this.natureSound.connect(natureGain);
      natureGain.connect(this.audioContext.destination);
      this.natureSound.start();
    } catch (error) {
      console.warn('No se pudo cargar el sonido de naturaleza:', error);
    }
  }

  stop() {
    if (this.leftOscillator) {
      this.leftOscillator.stop();
      this.leftOscillator.disconnect();
    }
    if (this.rightOscillator) {
      this.rightOscillator.stop();
      this.rightOscillator.disconnect();
    }
    if (this.natureSound) {
      this.natureSound.stop();
      this.natureSound.disconnect();
    }
    this.isPlaying = false;
  }

  setVolume(value) {
    if (this.masterGain) {
      this.masterGain.gain.value = Math.max(0, Math.min(1, value));
    }
  }

  getFrequencyInfo() {
    if (!this.leftOscillator || !this.rightOscillator) return null;
    return {
      left: this.leftOscillator.frequency.value,
      right: this.rightOscillator.frequency.value,
      beat: Math.abs(this.rightOscillator.frequency.value - this.leftOscillator.frequency.value)
    };
  }
}

// Instancia singleton
export const audioEngine = new BinauralAudioEngine();
