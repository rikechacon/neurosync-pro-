/**
 * Motor de Audio Binaural - Versión 3 (Timing Corregido)
 * Secuencia: 1) Cargar naturaleza, 2) Iniciar beats, 3) Sincronizar
 */

export class BinauralAudioEngine {
  constructor() {
    this.audioContext = null;
    this.leftOscillator = null;
    this.rightOscillator = null;
    this.natureSound = null;
    this.isPlaying = false;
    this.onProgress = null;
    this.onComplete = null;
    this.progressInterval = null;
    this.startTime = null;
    this.totalDuration = null;
    
    // Nodos de ganancia
    this.masterGain = null;
    this.beatsGain = null;
    this.natureGain = null;
    
    // Estado
    this.isNatureLoaded = false;
    this.areBeatsStarted = false;
  }

  async initialize() {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      
      // Cadena de audio: sources → gains → master → destination
      this.masterGain = this.audioContext.createGain();
      this.masterGain.gain.value = 0.8;
      this.masterGain.connect(this.audioContext.destination);
      
      this.beatsGain = this.audioContext.createGain();
      this.beatsGain.gain.value = 0.15;
      this.beatsGain.connect(this.masterGain);
      
      this.natureGain = this.audioContext.createGain();
      this.natureGain.gain.value = 0.5;
      this.natureGain.connect(this.masterGain);
      
      console.log('✅ AudioContext creado');
    }
    
    if (this.audioContext.state === 'suspended') {
      await this.audioContext.resume();
      console.log('✅ AudioContext resumed');
    }
  }

  async playRoutine(params) {
    console.log('🎧 [1/4] Iniciando rutina:', params.beatFreq, 'Hz');
    await this.initialize();
    
    // Resetear estado
    this.stop();
    this.isNatureLoaded = false;
    this.areBeatsStarted = false;

    const { carrierFreq, beatFreq, natureSoundUrl, duration } = params;

    try {
      // PASO 1: Cargar sonido de naturaleza PRIMERO (si existe)
      if (natureSoundUrl) {
        console.log('🎧 [2/4] Cargando sonido:', natureSoundUrl);
        await this.loadNatureSound(natureSoundUrl);
        this.isNatureLoaded = true;
        console.log('✅ Naturaleza cargada');
      }

      // PASO 2: Iniciar beats binaurales
      console.log('🎧 [3/4] Iniciando beats binaurales');
      await this.startBeats(carrierFreq, beatFreq);
      this.areBeatsStarted = true;
      console.log('✅ Beats iniciados');

      // PASO 3: Configurar temporizadores
      this.isPlaying = true;
      this.startTime = Date.now();
      this.totalDuration = duration * 1000;
      console.log('🎧 [4/4] Sesión activa - Duración:', duration, 'segundos');

      // Parada automática
      setTimeout(() => {
        console.log('⏰ Sesión completada');
        this.stop();
        if (this.onComplete) this.onComplete();
      }, duration * 1000);

      // Loop de progreso
      this.progressInterval = setInterval(() => {
        if (this.onProgress && this.totalDuration) {
          const elapsed = Date.now() - this.startTime;
          const progress = Math.min(elapsed / this.totalDuration, 1);
          this.onProgress(progress);
        }
      }, 100);

      return true;
    } catch (error) {
      console.error('❌ Error en playRoutine:', error);
      this.stop();
      throw error;
    }
  }

  async startBeats(carrierFreq, beatFreq) {
    // Crear osciladores
    this.leftOscillator = this.audioContext.createOscillator();
    this.rightOscillator = this.audioContext.createOscillator();
    
    const leftGain = this.audioContext.createGain();
    const rightGain = this.audioContext.createGain();

    // Configurar frecuencias
    this.leftOscillator.frequency.value = carrierFreq;
    this.rightOscillator.frequency.value = carrierFreq + beatFreq;
    this.leftOscillator.type = 'sine';
    this.rightOscillator.type = 'sine';

    // Volumen
    leftGain.gain.value = 0.25;
    rightGain.gain.value = 0.25;

    // Conectar: oscilador → gain individual → beatsGain → master → destination
    this.leftOscillator.connect(leftGain);
    this.rightOscillator.connect(rightGain);
    leftGain.connect(this.beatsGain);
    rightGain.connect(this.beatsGain);

    // Iniciar osciladores
    this.leftOscillator.start();
    this.rightOscillator.start();
  }

  async loadNatureSound(url) {
    console.log('📡 Fetching:', url);
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    console.log('📥 Decodificando audio...');
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
    
    console.log('🎵 Buffer listo:', audioBuffer.duration.toFixed(2), 'segundos');

    // Crear buffer source
    this.natureSound = this.audioContext.createBufferSource();
    this.natureSound.buffer = audioBuffer;
    this.natureSound.loop = true;

    // Conectar: buffer → natureGain → master → destination
    this.natureSound.connect(this.natureGain);
    
    // Iniciar inmediatamente (no esperar a que los beats estén listos)
    this.natureSound.start();
    
    console.log('✅ Sonido de naturaleza iniciado');
  }

  stop() {
    console.log('🛑 Deteniendo todos los nodos');
    
    // Detener beats
    if (this.leftOscillator) {
      try {
        this.leftOscillator.stop();
        this.leftOscillator.disconnect();
      } catch (e) { /* Ignorar si ya estaba detenido */ }
      this.leftOscillator = null;
    }
    if (this.rightOscillator) {
      try {
        this.rightOscillator.stop();
        this.rightOscillator.disconnect();
      } catch (e) {}
      this.rightOscillator = null;
    }

    // Detener naturaleza
    if (this.natureSound) {
      try {
        this.natureSound.stop();
        this.natureSound.disconnect();
      } catch (e) {}
      this.natureSound = null;
    }

    // Limpiar intervalo
    if (this.progressInterval) {
      clearInterval(this.progressInterval);
      this.progressInterval = null;
    }

    // Resetear estado
    this.isPlaying = false;
    this.isNatureLoaded = false;
    this.areBeatsStarted = false;
    
    console.log('✅ Todos los nodos detenidos');
  }

  async pause() {
    if (this.audioContext?.state === 'running') {
      await this.audioContext.suspend();
      this.isPlaying = false;
      console.log('⏸️ Pausado');
    }
  }

  async resume() {
    if (this.audioContext?.state === 'suspended') {
      await this.audioContext.resume();
      this.isPlaying = true;
      console.log('▶️ Reanudado');
    }
  }

  // Controles de volumen independientes
  setBeatsVolume(value) {
    if (this.beatsGain) {
      this.beatsGain.gain.value = Math.max(0, Math.min(1, value));
    }
  }

  setNatureVolume(value) {
    if (this.natureGain) {
      this.natureGain.gain.value = Math.max(0, Math.min(1, value));
    }
  }

  setMasterVolume(value) {
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

  getStatus() {
    return {
      isPlaying: this.isPlaying,
      isNatureLoaded: this.isNatureLoaded,
      areBeatsStarted: this.areBeatsStarted,
      contextState: this.audioContext?.state
    };
  }
}

export const audioEngine = new BinauralAudioEngine();
