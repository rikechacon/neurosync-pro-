/**
 * Motor de Audio Binaural - Versión con Perfiles Inteligentes
 * Soporta: Fade in/out, frecuencia adaptativa, volumen dinámico
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
    this.profile = null;
    this.frequencyRampInterval = null;
    this.currentRampStage = 0;
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

  async playRoutine(params, profile = null) {
    try {
      await this.initialize();
      this.stop();
      
      this.params = params;
      this.profile = profile;
      this.currentFreq = params.beatFreq;
      this.isHealingMode = !!params.isHealing;

      console.log(`🎵 Iniciando sesión: ${params.beatFreq} Hz`);
      if (profile) {
        console.log(`🧠 Perfil: ${profile.name}`);
        console.log(`💬 ${profile.message}`);
      }

      // Aplicar configuración del perfil
      const fadeIn = profile?.fadeIn?.enabled ? profile.fadeIn : { enabled: false };
      const natureVolume = profile?.natureVolume?.initial || 0.5;

      // Configurar volumen inicial de naturaleza
      this.natureGain.gain.value = natureVolume;

      // Determinar modo: < 30 Hz = binaural, >= 30 Hz = tono puro
      const useBinaural = this.currentFreq < 30;
      
      if (useBinaural) {
        await this.startBinauralBeats(params.carrierFreq, this.currentFreq, fadeIn);
      } else {
        await this.startPureTone(this.currentFreq, fadeIn);
      }

      // Iniciar rampa de frecuencia si está habilitada
      if (profile?.frequencyRamp?.enabled && profile.frequencyRamp.stages) {
        this.startFrequencyRamp(profile.frequencyRamp.stages, params.carrierFreq);
      }

      if (params.natureSoundUrl) {
        await this.loadNatureSound(params.natureSoundUrl);
      }

      this.isPlaying = true;
      this.isPaused = false;
      this.startTime = Date.now();
      this.totalDuration = params.duration * 1000;

      // Programar fade out si está habilitado
      if (profile?.fadeOut?.enabled) {
        this.scheduleFadeOut(profile.fadeOut);
      }

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

  async startBinauralBeats(carrierFreq, beatFreq, fadeIn = null) {
    if (!this.audioContext) return;
    
    this.leftOscillator = this.audioContext.createOscillator();
    this.rightOscillator = this.audioContext.createOscillator();
    
    const now = this.audioContext.currentTime;
    
    this.leftOscillator.frequency.value = carrierFreq;
    this.rightOscillator.frequency.value = carrierFreq + beatFreq;
    this.leftOscillator.type = 'sine';
    this.rightOscillator.type = 'sine';

    const leftGain = this.audioContext.createGain();
    const rightGain = this.audioContext.createGain();

    // Aplicar fade in si está configurado
    if (fadeIn?.enabled) {
      leftGain.gain.setValueAtTime(fadeIn.initialVolume, now);
      leftGain.gain.linearRampToValueAtTime(fadeIn.targetVolume, now + fadeIn.duration);
      rightGain.gain.setValueAtTime(fadeIn.initialVolume, now);
      rightGain.gain.linearRampToValueAtTime(fadeIn.targetVolume, now + fadeIn.duration);
      
      console.log(`🎧 Fade in: ${fadeIn.initialVolume} → ${fadeIn.targetVolume} en ${fadeIn.duration}s`);
    } else {
      leftGain.gain.setValueAtTime(0.25, now);
      rightGain.gain.setValueAtTime(0.25, now);
    }

    this.leftOscillator.connect(leftGain);
    leftGain.connect(this.beatsGain);
    this.beatsGain.connect(this.analyser);
    
    this.rightOscillator.connect(rightGain);
    rightGain.connect(this.beatsGain);
    
    this.leftOscillator.start(now);
    this.rightOscillator.start(now);
    
    console.log(`🎧 Binaural: Izq=${carrierFreq}Hz, Der=${carrierFreq + beatFreq}Hz, Beat=${beatFreq}Hz`);
  }

  async startPureTone(frequency, fadeIn = null) {
    if (!this.audioContext) return;
    
    this.leftOscillator = this.audioContext.createOscillator();
    this.rightOscillator = this.audioContext.createOscillator();
    
    const now = this.audioContext.currentTime;
    
    this.leftOscillator.frequency.value = frequency;
    this.rightOscillator.frequency.value = frequency;
    this.leftOscillator.type = 'sine';
    this.rightOscillator.type = 'sine';

    const leftGain = this.audioContext.createGain();
    const rightGain = this.audioContext.createGain();

    // Aplicar fade in si está configurado
    if (fadeIn?.enabled) {
      leftGain.gain.setValueAtTime(fadeIn.initialVolume, now);
      leftGain.gain.linearRampToValueAtTime(fadeIn.targetVolume, now + fadeIn.duration);
      rightGain.gain.setValueAtTime(fadeIn.initialVolume, now);
      rightGain.gain.linearRampToValueAtTime(fadeIn.targetVolume, now + fadeIn.duration);
      
      console.log(`🎵 Fade in: ${fadeIn.initialVolume} → ${fadeIn.targetVolume} en ${fadeIn.duration}s`);
    } else {
      leftGain.gain.setValueAtTime(0.20, now);
      rightGain.gain.setValueAtTime(0.20, now);
    }

    this.leftOscillator.connect(leftGain);
    leftGain.connect(this.beatsGain);
    this.beatsGain.connect(this.analyser);
    
    this.rightOscillator.connect(rightGain);
    rightGain.connect(this.beatsGain);

    this.leftOscillator.start(now);
    this.rightOscillator.start(now);
    
    console.log(`🎵 Tono puro: ${frequency}Hz en AMBOS canales`);
  }

  startFrequencyRamp(stages, carrierFreq) {
    console.log(`📈 Iniciando rampa de frecuencia: ${stages.length} etapas`);
    
    this.currentRampStage = 0;
    const stageDuration = stages[0]?.duration || 300000; // 5 min default
    
    const applyStage = (stageIndex) => {
      if (!this.isPlaying || stageIndex >= stages.length) {
        console.log('✅ Rampa de frecuencia completada');
        return;
      }
      
      const stage = stages[stageIndex];
      this.currentFreq = stage.beatFreq;
      
      if (this.rightOscillator && this.leftOscillator) {
        const now = this.audioContext.currentTime;
        const targetFreq = carrierFreq + stage.beatFreq;
        
        // Transición suave entre frecuencias
        this.rightOscillator.frequency.setTargetAtTime(targetFreq, now, 10);
        
        console.log(`📊 Etapa ${stageIndex + 1}/${stages.length}: ${stage.beatFreq} Hz (${stage.band}) - ${stage.label}`);
      }
      
      // Programar siguiente etapa
      this.frequencyRampInterval = setTimeout(() => {
        applyStage(stageIndex + 1);
      }, stageDuration);
    };
    
    applyStage(0);
  }

  scheduleFadeOut(fadeOut) {
    const fadeOutTime = this.totalDuration - (fadeOut.duration * 1000);
    
    setTimeout(() => {
      if (!this.isPlaying || this.isPaused) return;
      
      const now = this.audioContext.currentTime;
      
      this.beatsGain.gain.setTargetAtTime(
        fadeOut.finalVolume || 0.05,
        now,
        fadeOut.duration / 4
      );
      
      console.log(`📉 Fade out: ${fadeOut.duration}s hacia ${fadeOut.finalVolume || 0.05}`);
    }, fadeOutTime);
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
    if (this.frequencyRampInterval) {
      clearTimeout(this.frequencyRampInterval);
      this.frequencyRampInterval = null;
    }
  }

  async resume() {
    if (!this.isPaused || !this.params || !this.audioContext) return;
    await this.audioContext.resume();
    await this.playRoutine(this.params, this.profile);
  }

  stop() {
    console.log('🛑 Deteniendo audio...');
    
    if (this.progressInterval) {
      clearInterval(this.progressInterval);
      this.progressInterval = null;
    }
    
    if (this.frequencyRampInterval) {
      clearTimeout(this.frequencyRampInterval);
      this.frequencyRampInterval = null;
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
      current: this.currentFreq,
      profile: this.profile?.name
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
