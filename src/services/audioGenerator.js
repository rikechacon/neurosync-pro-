/**
 * Motor de Audio Binaural - Versión Corregida Pausa
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
    this.elapsedBeforePause = 0;
    this.masterGain = null;
    this.beatsGain = null;
    this.natureGain = null;
    this.isSchumannScan = false;
    this.scanSequence = null;
    this.scanIndex = 0;
    this.scanInterval = null;
    this.currentBeatFreq = null;
    this.isHealingMode = false;
    this.therapeuticFrequency = null;
    this.params = null; // Guardar parámetros para resume
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
    }
    
    if (this.audioContext.state === 'suspended') {
      await this.audioContext.resume();
    }
  }

  async playRoutine(params) {
    await this.initialize();
    
    // Si está pausado, reanudar
    if (this.isPaused) {
      await this.resume();
      return;
    }
    
    // Si no, iniciar nueva sesión
    this.stop();
    this.params = params; // Guardar parámetros
    
    const { 
      carrierFreq, 
      beatFreq, 
      natureSoundUrl, 
      duration, 
      isSchumann, 
      schumannMode, 
      scanSequence,
      isHealing,
      therapeuticFrequency
    } = params;
    
    this.currentBeatFreq = beatFreq;
    this.isHealingMode = !!isHealing;
    this.therapeuticFrequency = therapeuticFrequency;

    if (isSchumann && schumannMode === 'scan' && scanSequence) {
      this.isSchumannScan = true;
      this.scanSequence = scanSequence;
      this.scanIndex = 0;
    } else {
      this.isSchumannScan = false;
    }

    if (this.isHealingMode && this.therapeuticFrequency) {
      await this.startHealingFrequency(this.therapeuticFrequency, carrierFreq);
    } else {
      await this.startBeats(carrierFreq, this.currentBeatFreq);
    }

    if (natureSoundUrl) {
      await this.loadNatureSound(natureSoundUrl);
    }

    if (this.isSchumannScan) {
      this.startSchumannScan(carrierFreq);
    }

    this.isPlaying = true;
    this.isPaused = false;
    this.startTime = Date.now() - this.elapsedBeforePause;
    this.totalDuration = duration * 1000;

    setTimeout(() => {
      this.stop();
      if (this.onComplete) this.onComplete();
    }, duration * 1000 - this.elapsedBeforePause);

    this.progressInterval = setInterval(() => {
      if (this.onProgress && this.totalDuration) {
        const elapsed = Date.now() - this.startTime;
        const progress = Math.min(elapsed / this.totalDuration, 1);
        this.onProgress(progress);
      }
    }, 100);

    return true;
  }

  async startBeats(carrierFreq, beatFreq) {
    this.leftOscillator = this.audioContext.createOscillator();
    this.rightOscillator = this.audioContext.createOscillator();
    
    const leftGain = this.audioContext.createGain();
    const rightGain = this.audioContext.createGain();

    this.leftOscillator.frequency.value = carrierFreq;
    this.rightOscillator.frequency.value = carrierFreq + beatFreq;
    this.leftOscillator.type = 'sine';
    this.rightOscillator.type = 'sine';

    leftGain.gain.value = 0.25;
    rightGain.gain.value = 0.25;

    this.leftOscillator.connect(leftGain);
    this.rightOscillator.connect(rightGain);
    leftGain.connect(this.beatsGain);
    rightGain.connect(this.beatsGain);

    this.leftOscillator.start();
    this.rightOscillator.start();
  }

  async startHealingFrequency(therapeuticFreq, carrierFreq) {
    if (therapeuticFreq > 1000) {
      this.leftOscillator = this.audioContext.createOscillator();
      this.rightOscillator = this.audioContext.createOscillator();
      
      this.leftOscillator.frequency.value = therapeuticFreq;
      this.rightOscillator.frequency.value = therapeuticFreq;
      this.leftOscillator.type = 'sine';
      this.rightOscillator.type = 'sine';

      const highFreqGain = 0.1;
      const leftGain = this.audioContext.createGain();
      const rightGain = this.audioContext.createGain();
      leftGain.gain.value = highFreqGain;
      rightGain.gain.value = highFreqGain;

      this.leftOscillator.connect(leftGain);
      this.rightOscillator.connect(rightGain);
      leftGain.connect(this.beatsGain);
      rightGain.connect(this.beatsGain);

      this.leftOscillator.start();
      this.rightOscillator.start();
    } else if (therapeuticFreq >= 396 && therapeuticFreq <= 963) {
      this.leftOscillator = this.audioContext.createOscillator();
      this.rightOscillator = this.audioContext.createOscillator();
      
      this.leftOscillator.frequency.value = carrierFreq;
      this.rightOscillator.frequency.value = carrierFreq + therapeuticFreq;
      this.leftOscillator.type = 'sine';
      this.rightOscillator.type = 'sine';

      const leftGain = this.audioContext.createGain();
      const rightGain = this.audioContext.createGain();
      leftGain.gain.value = 0.2;
      rightGain.gain.value = 0.2;

      this.leftOscillator.connect(leftGain);
      this.rightOscillator.connect(rightGain);
      leftGain.connect(this.beatsGain);
      rightGain.connect(this.beatsGain);

      this.leftOscillator.start();
      this.rightOscillator.start();
    } else {
      await this.startBeats(carrierFreq, therapeuticFreq);
    }
  }

  startSchumannScan(carrierFreq) {
    this.scanInterval = setInterval(() => {
      if (!this.isPlaying || this.isPaused) return;
      
      this.scanIndex = (this.scanIndex + 1) % this.scanSequence.length;
      const newFreq = this.scanSequence[this.scanIndex];
      this.currentBeatFreq = newFreq;
      
      if (this.rightOscillator && !this.isHealingMode) {
        this.rightOscillator.frequency.value = carrierFreq + newFreq;
      }
    }, 30000);
  }

  async loadNatureSound(url) {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);

      this.natureSound = this.audioContext.createBufferSource();
      this.natureSound.buffer = audioBuffer;
      this.natureSound.loop = true;
      this.natureSound.connect(this.natureGain);
      this.natureSound.start();
    } catch (error) {
      console.error('Error cargando sonido:', error);
      throw error;
    }
  }

  async pause() {
    if (!this.isPlaying || this.isPaused) return;
    
    console.log('⏸️ Pausando...');
    this.elapsedBeforePause = Date.now() - this.startTime;
    
    // Suspender contexto de audio
    await this.audioContext.suspend();
    
    // Detener intervalos pero guardar estado
    if (this.progressInterval) {
      clearInterval(this.progressInterval);
      this.progressInterval = null;
    }
    if (this.scanInterval) {
      clearInterval(this.scanInterval);
      this.scanInterval = null;
    }
    
    this.isPaused = true;
    this.isPlaying = false;
    
    console.log('✅ Pausado en:', (this.elapsedBeforePause / 1000).toFixed(1), 'segundos');
  }

  async resume() {
    if (!this.isPaused || !this.params) return;
    
    console.log('▶️ Reanudando...');
    
    // Reanudar contexto
    await this.audioContext.resume();
    
    // Reiniciar audio con parámetros guardados
    await this.playRoutine(this.params);
    
    this.isPaused = false;
    this.isPlaying = true;
    
    console.log('✅ Reanudado');
  }

  stop() {
    if (this.leftOscillator) {
      try { this.leftOscillator.stop(); this.leftOscillator.disconnect(); } catch (e) {}
      this.leftOscillator = null;
    }
    if (this.rightOscillator) {
      try { this.rightOscillator.stop(); this.rightOscillator.disconnect(); } catch (e) {}
      this.rightOscillator = null;
    }
    if (this.natureSound) {
      try { this.natureSound.stop(); this.natureSound.disconnect(); } catch (e) {}
      this.natureSound = null;
    }
    if (this.progressInterval) {
      clearInterval(this.progressInterval);
      this.progressInterval = null;
    }
    if (this.scanInterval) {
      clearInterval(this.scanInterval);
      this.scanInterval = null;
    }
    
    this.isPlaying = false;
    this.isPaused = false;
    this.elapsedBeforePause = 0;
    this.isSchumannScan = false;
    this.isHealingMode = false;
    this.currentBeatFreq = null;
    this.therapeuticFrequency = null;
    this.params = null;
  }

  setBeatsVolume(value) {
    if (this.beatsGain) this.beatsGain.gain.value = Math.max(0, Math.min(1, value));
  }

  setNatureVolume(value) {
    if (this.natureGain) this.natureGain.gain.value = Math.max(0, Math.min(1, value));
  }

  setMasterVolume(value) {
    if (this.masterGain) this.masterGain.gain.value = Math.max(0, Math.min(1, value));
  }

  getCurrentFrequency() {
    return this.isHealingMode ? this.therapeuticFrequency : this.currentBeatFreq;
  }

  getFrequencyInfo() {
    if (!this.leftOscillator || !this.rightOscillator) return null;
    return {
      left: this.leftOscillator.frequency.value,
      right: this.rightOscillator.frequency.value,
      beat: Math.abs(this.rightOscillator.frequency.value - this.leftOscillator.frequency.value),
      isHealing: this.isHealingMode,
      therapeuticFreq: this.therapeuticFrequency,
      isPaused: this.isPaused
    };
  }
}

export const audioEngine = new BinauralAudioEngine();
