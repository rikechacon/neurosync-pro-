/**
 * Motor de Audio Binaural - Versión Final Corregida
 * - < 30 Hz: Beats binaurales (diferencia entre canales)
 * - >= 30 Hz: TONO PURO (misma frecuencia en ambos canales)
 */

export class BinauralAudioEngine {
  constructor() {
    this.audioContext = null;
    this.leftOscillator = null;
    this.rightOscillator = null;
    this.natureSound = null;
    this.isPlaying = false;
    this.isPaused = false;
    this.onProgress = null;
    this.onComplete = null;
    this.progressInterval = null;
    this.startTime = null;
    this.totalDuration = null;
    
    this.masterGain = null;
    this.beatsGain = null;
    this.natureGain = null;
    this.analyser = null;
    this.frequencyData = null;
    
    this.currentFreq = null;
    this.isHealingMode = false;
    this.params = null;
  }

  async initialize() {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      
      this.masterGain = this.audioContext.createGain();
      this.masterGain.gain.value = 0.8;
      this.masterGain.connect(this.audioContext.destination);
      
      this.beatsGain = this.audioContext.createGain();
      this.beatsGain.gain.value = 0.15;
      this.beatsGain.connect(this.masterGain);
      
      this.natureGain = this.audioContext.createGain();
      this.natureGain.gain.value = 0.5;
      this.natureGain.connect(this.masterGain);
      
      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = 256;
      this.analyser.connect(this.masterGain);
      
      this.frequencyData = new Uint8Array(this.analyser.frequencyBinCount);
    }
    
    if (this.audioContext.state === 'suspended') {
      await this.audioContext.resume();
    }
  }

  async playRoutine(params) {
    try {
      await this.initialize();
      this.stop();
      
      this.params = params;
      this.currentFreq = params.beatFreq;
      this.isHealingMode = !!params.isHealing;

      // Determinar modo: < 30 Hz = binaural, >= 30 Hz = tono puro
      const useBinaural = this.currentFreq < 30;
      
      console.log(`🎵 Iniciando: ${this.currentFreq} Hz - Modo: ${useBinaural ? 'BINAURAL' : 'TONO PURO'}`);

      if (useBinaural) {
        // MODO BINAURAL: carrier + beat
        await this.startBinauralBeats(params.carrierFreq, this.currentFreq);
      } else {
        // MODO TONO PURO: misma frecuencia en ambos canales
        await this.startPureTone(this.currentFreq);
      }

      if (params.natureSoundUrl) {
        await this.loadNatureSound(params.natureSoundUrl);
      }

      this.isPlaying = true;
      this.isPaused = false;
      this.startTime = Date.now();
      this.totalDuration = params.duration * 1000;

      setTimeout(() => {
        this.stop();
        if (this.onComplete) this.onComplete();
      }, params.duration * 1000);

      this.progressInterval = setInterval(() => {
        if (this.onProgress && this.totalDuration) {
          const elapsed = Date.now() - this.startTime;
          this.onProgress(Math.min(elapsed / this.totalDuration, 1));
        }
      }, 100);
    } catch (error) {
      console.error('Error en playRoutine:', error);
      throw error;
    }
  }

  async startBinauralBeats(carrierFreq, beatFreq) {
    if (!this.audioContext) return;
    
    this.leftOscillator = this.audioContext.createOscillator();
    this.rightOscillator = this.audioContext.createOscillator();
    
    const now = this.audioContext.currentTime;
    
    // Frecuencias DIFERENTES para crear beat
    this.leftOscillator.frequency.value = carrierFreq;
    this.rightOscillator.frequency.value = carrierFreq + beatFreq;
    this.leftOscillator.type = 'sine';
    this.rightOscillator.type = 'sine';

    const leftGain = this.audioContext.createGain();
    const rightGain = this.audioContext.createGain();
    leftGain.gain.setValueAtTime(0, now);
    leftGain.gain.linearRampToValueAtTime(0.25, now + 0.1);
    rightGain.gain.setValueAtTime(0, now);
    rightGain.gain.linearRampToValueAtTime(0.25, now + 0.1);

    this.leftOscillator.connect(leftGain);
    leftGain.connect(this.beatsGain);
    this.beatsGain.connect(this.analyser);
    
    this.rightOscillator.connect(rightGain);
    rightGain.connect(this.beatsGain);
    
    this.leftOscillator.start(now);
    this.rightOscillator.start(now);
    
    console.log(`🎧 Binaural: Izq=${carrierFreq}Hz, Der=${carrierFreq + beatFreq}Hz, Beat=${beatFreq}Hz`);
  }

  async startPureTone(frequency) {
    if (!this.audioContext) return;
    
    this.leftOscillator = this.audioContext.createOscillator();
    this.rightOscillator = this.audioContext.createOscillator();
    
    const now = this.audioContext.currentTime;
    
    // MISMA frecuencia en ambos canales (TONO PURO)
    this.leftOscillator.frequency.value = frequency;
    this.rightOscillator.frequency.value = frequency;
    this.leftOscillator.type = 'sine';
    this.rightOscillator.type = 'sine';

    const leftGain = this.audioContext.createGain();
    const rightGain = this.audioContext.createGain();
    leftGain.gain.setValueAtTime(0, now);
    leftGain.gain.linearRampToValueAtTime(0.2, now + 0.1);
    rightGain.gain.setValueAtTime(0, now);
    rightGain.gain.linearRampToValueAtTime(0.2, now + 0.1);

    this.leftOscillator.connect(leftGain);
    leftGain.connect(this.beatsGain);
    this.beatsGain.connect(this.analyser);
    
    this.rightOscillator.connect(rightGain);
    rightGain.connect(this.beatsGain);

    this.leftOscillator.start(now);
    this.rightOscillator.start(now);
    
    console.log(`🎵 Tono puro: ${frequency}Hz en AMBOS canales`);
  }

  async loadNatureSound(url) {
    try {
      const response = await fetch(url);
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);

      this.natureSound = this.audioContext.createBufferSource();
      this.natureSound.buffer = audioBuffer;
      this.natureSound.loop = true;
      this.natureSound.connect(this.natureGain);
      this.natureSound.start();
    } catch (error) {
      console.error('Error cargando sonido:', error);
    }
  }

  async pause() {
    if (!this.isPlaying || this.isPaused || !this.audioContext) return;
    await this.audioContext.suspend();
    this.isPaused = true;
    this.isPlaying = false;
    if (this.progressInterval) {
      clearInterval(this.progressInterval);
      this.progressInterval = null;
    }
  }

  async resume() {
    if (!this.isPaused || !this.params || !this.audioContext) return;
    await this.audioContext.resume();
    await this.playRoutine(this.params);
  }

  stop() {
    console.log('🛑 Deteniendo audio...');
    
    if (this.progressInterval) {
      clearInterval(this.progressInterval);
      this.progressInterval = null;
    }
    
    try {
      if (this.leftOscillator) {
        this.leftOscillator.stop();
        this.leftOscillator.disconnect();
        this.leftOscillator = null;
      }
    } catch (e) {}
    
    try {
      if (this.rightOscillator) {
        this.rightOscillator.stop();
        this.rightOscillator.disconnect();
        this.rightOscillator = null;
      }
    } catch (e) {}
    
    try {
      if (this.natureSound) {
        this.natureSound.stop();
        this.natureSound.disconnect();
        this.natureSound = null;
      }
    } catch (e) {}
    
    this.isPlaying = false;
    this.isPaused = false;
    console.log('✅ Audio detenido');
  }

  setBeatsVolume(value) {
    if (this.beatsGain) this.beatsGain.gain.value = Math.max(0, Math.min(1, value));
  }

  setNatureVolume(value) {
    if (this.natureGain) this.natureGain.gain.value = Math.max(0, Math.min(1, value));
  }

  getFrequencyInfo() {
    if (!this.leftOscillator || !this.rightOscillator) return null;
    return {
      left: this.leftOscillator.frequency.value,
      right: this.rightOscillator.frequency.value,
      current: this.currentFreq
    };
  }

  getFrequencyData() {
    if (!this.analyser) return null;
    this.analyser.getByteFrequencyData(this.frequencyData);
    return Array.from(this.frequencyData);
  }
}

export const audioEngine = new BinauralAudioEngine();

if (typeof window !== 'undefined') {
  window.audioEngine = audioEngine;
}
