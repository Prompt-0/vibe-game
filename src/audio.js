/**
 * AudioSynthesizer manages the Web Audio API lifecycle, background ambient synthesis,
 * theme scales, and interactive sound notes/chords.
 */
export class AudioSynthesizer {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.analyser = null;
    this.isPaused = true;
    this.volume = 0.5;
    this.theme = 'nature';
    this.activeOscillators = [];
    
    // Scale definitions (in Hz) matching nature, abstract, and cosmic themes
    this.scales = {
      nature: [261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 587.33, 659.25, 783.99, 880.00], // C Maj Pentatonic (C4 to A5)
      abstract: [261.63, 293.66, 329.63, 369.99, 415.30, 466.16, 523.25, 587.33, 659.25, 739.99], // C Whole Tone
      cosmic: [261.63, 311.13, 349.23, 392.00, 466.16, 523.25, 622.25, 698.46, 783.99, 932.33]  // C Min Pentatonic
    };

    // Background pads tracking
    this.backgroundPads = [];
    this.schedulerIntervalId = null;
    this.currentChordIndex = 0;
    this.nextChordTime = 0;

    // Chord progression definitions for the background synthesis
    this.chordProgressions = {
      nature: [
        [261.63, 329.63, 392.00], // C Maj
        [349.23, 440.00, 523.25], // F Maj
        [220.00, 261.63, 329.63], // A min
        [196.00, 246.94, 293.66]  // G Maj
      ],
      abstract: [
        [261.63, 329.63, 415.30], // C aug
        [293.66, 369.99, 466.16], // D aug
        [329.63, 415.30, 523.25]  // E aug
      ],
      cosmic: [
        [261.63, 311.13, 392.00, 466.16], // C min7
        [174.61, 207.65, 261.63, 311.13], // F min7
        [311.13, 392.00, 466.16, 587.33], // Eb maj7
        [207.65, 261.63, 311.13, 392.00]  // Ab maj7
      ]
    };
  }

  /**
   * Initializes the AudioContext and connection graph.
   * Required to run after user interaction due to browser security policies.
   */
  initContext() {
    if (this.ctx) return;

    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    this.ctx = new AudioContextClass();
    
    // Master volume control
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.value = this.volume;

    // Analyser node for visual synchronisation
    this.analyser = this.ctx.createAnalyser();
    this.analyser.fftSize = 256;

    // Routing graph: Source -> Master Gain -> Analyser -> Destination
    this.masterGain.connect(this.analyser);
    this.analyser.connect(this.ctx.destination);
  }

  /**
   * Adjusts the master synthesizer volume.
   * @param {number} val - Volume level from 0.0 to 1.0
   */
  setVolume(val) {
    this.volume = Math.max(0, Math.min(1, val));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
    }
  }

  /**
   * Starts ambient synthesis and resumes audio context.
   */
  play() {
    this.initContext();
    this.isPaused = false;
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    // Start ambient loops or generator scheduling here
    this.startScheduler();
  }

  /**
   * Pauses synthesis and suspends audio context.
   */
  pause() {
    this.isPaused = true;
    if (this.ctx && this.ctx.state === 'running') {
      this.ctx.suspend();
    }
    this.stopScheduler();
  }

  /**
   * Starts the continuous background scheduler.
   */
  startScheduler() {
    if (this.schedulerIntervalId) return;

    // Initialize/Reset chord time based on current audio context time
    this.nextChordTime = this.ctx.currentTime;
    this.currentChordIndex = 0;

    const schedule = () => {
      if (this.isPaused || !this.ctx) return;

      const now = this.ctx.currentTime;
      const lookAhead = 1.5;
      const chordInterval = 5.0;

      if (this.nextChordTime < now) {
        this.nextChordTime = now;
      }

      while (this.nextChordTime < now + lookAhead) {
        this.scheduleChordAt(this.nextChordTime);
        this.nextChordTime += chordInterval;
      }

      this.prunePads();
    };

    // Trigger initial schedule synchronously to avoid gaps
    schedule();

    // Poll every 500ms for look-ahead scheduling
    this.schedulerIntervalId = setInterval(schedule, 500);
  }

  /**
   * Stops the continuous background scheduler.
   */
  stopScheduler() {
    if (this.schedulerIntervalId) {
      clearInterval(this.schedulerIntervalId);
      this.schedulerIntervalId = null;
    }
  }

  /**
   * Schedules a single background chord at the specified time.
   * @param {number} time - AudioContext time in seconds
   */
  scheduleChordAt(time) {
    if (!this.ctx) return;

    const themeChords = this.chordProgressions[this.theme] || this.chordProgressions.nature;
    const chordIndex = this.currentChordIndex % themeChords.length;
    const chordNotes = themeChords[chordIndex];
    this.currentChordIndex++;

    const attackTime = 2.0;
    const releaseTime = 3.0;
    const chordDuration = 8.0;
    const targetGain = 0.05; // Soft ambient volume

    const chordGain = this.ctx.createGain();
    chordGain.gain.setValueAtTime(0, time);
    chordGain.gain.linearRampToValueAtTime(targetGain, time + attackTime);
    chordGain.gain.setValueAtTime(targetGain, time + chordDuration - releaseTime);
    chordGain.gain.exponentialRampToValueAtTime(0.001, time + chordDuration);

    chordGain.connect(this.masterGain);

    let waveType = 'sine';
    if (this.theme === 'cosmic') {
      waveType = 'sine';
    } else if (this.theme === 'abstract') {
      waveType = 'triangle';
    } else {
      waveType = 'triangle'; // nature
    }

    const oscillators = [];
    chordNotes.forEach(freq => {
      const osc = this.ctx.createOscillator();
      osc.type = waveType;
      osc.frequency.setValueAtTime(freq, time);
      osc.connect(chordGain);
      osc.start(time);
      osc.stop(time + chordDuration);
      oscillators.push(osc);
    });

    this.backgroundPads.push({
      chordGain,
      oscillators,
      startTime: time,
      stopTime: time + chordDuration,
      theme: this.theme,
      fadedOut: false
    });
  }

  /**
   * Triggers smooth cross-fading of active pads during theme changes.
   */
  transitionTheme() {
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const fadeOutDuration = 1.8;

    // Fade out pads of other themes
    this.backgroundPads.forEach(pad => {
      if (pad.theme !== this.theme && !pad.fadedOut) {
        pad.fadedOut = true;
        pad.fadeEndTime = now + fadeOutDuration;

        const currentGain = pad.chordGain.gain.value;
        pad.chordGain.gain.setValueAtTime(currentGain, now);
        pad.chordGain.gain.exponentialRampToValueAtTime(0.001, now + fadeOutDuration);

        pad.stopTime = now + fadeOutDuration;
      }
    });

    // Reset sequence and trigger the first chord of the new theme immediately
    this.currentChordIndex = 0;
    this.nextChordTime = now;
    this.scheduleChordAt(now);
    this.nextChordTime = now + 5.0;
  }

  /**
   * Prunes and disconnects finished oscillators and gain nodes.
   */
  prunePads() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    // Prune background pads
    this.backgroundPads = this.backgroundPads.filter(pad => {
      if (pad.stopTime <= now || (pad.fadedOut && pad.fadeEndTime <= now)) {
        pad.oscillators.forEach(osc => {
          try { osc.disconnect(); } catch (e) {}
        });
        try { pad.chordGain.disconnect(); } catch (e) {}
        return false;
      }
      return true;
    });

    // Prune interactive oscillators
    this.activeOscillators = this.activeOscillators.filter(node => {
      if (node.stopTime <= now) {
        try { node.osc.disconnect(); } catch (e) {}
        try { node.noteGain.disconnect(); } catch (e) {}
        if (node.panner) {
          try { node.panner.disconnect(); } catch (e) {}
        }
        return false;
      }
      return true;
    });
  }

  /**
   * Updates audio characteristics or scale depending on active theme.
   * @param {string} themeName - 'nature' | 'abstract' | 'cosmic'
   */
  setTheme(themeName) {
    const validThemes = ['nature', 'abstract', 'cosmic'];
    this.theme = validThemes.includes(themeName) ? themeName : 'nature';

    // Transition background pads if context is running
    if (this.ctx && !this.isPaused) {
      this.transitionTheme();
    }
  }

  /**
   * Triggers an interactive note based on normalized interaction coordinates.
   * @param {number} x - Normalized x position (used for spatial panning)
   * @param {number} y - Normalized y position (used to calculate frequency/pitch)
   */
  triggerInteraction(x, y) {
    this.initContext();
    if (this.isPaused || !this.ctx) return;

    // Clamp coordinates to boundary [0, 1]
    const cx = Math.max(0, Math.min(1, x));
    const cy = Math.max(0, Math.min(1, y));

    // Map y-coordinate to index in the theme's scale (0 to scale.length - 1)
    const scale = this.scales[this.theme] || this.scales.nature;
    const index = Math.floor((1 - cy) * scale.length);
    const clampedIndex = Math.max(0, Math.min(scale.length - 1, index));
    const freq = scale[clampedIndex];

    // Map x-coordinate to panning (-1.0 to 1.0)
    const panVal = cx * 2 - 1;

    this.playNote(freq, panVal);
  }

  /**
   * Synthesizes and plays a discrete note using Web Audio oscillators.
   * @param {number} frequency - Frequency of note in Hz
   * @param {number} panning - Spatial panning (-1.0 to 1.0)
   */
  playNote(frequency, panning) {
    if (!this.ctx || this.ctx.state === 'suspended') return;

    // Clean up finished oscillators first
    this.prunePads();

    // Create Oscillator
    const osc = this.ctx.createOscillator();
    const noteGain = this.ctx.createGain();
    
    // Choose wave type based on theme
    if (this.theme === 'cosmic') {
      osc.type = 'sine';
    } else if (this.theme === 'abstract') {
      osc.type = 'triangle';
    } else {
      osc.type = 'triangle'; // Default nature
    }

    osc.frequency.setValueAtTime(frequency, this.ctx.currentTime);

    // Create Stereo Panner if supported
    let panner = null;
    if (this.ctx.createStereoPanner) {
      panner = this.ctx.createStereoPanner();
      panner.pan.setValueAtTime(panning, this.ctx.currentTime);
    }

    // Connect node chain
    if (panner) {
      osc.connect(panner);
      panner.connect(noteGain);
    } else {
      osc.connect(noteGain);
    }
    noteGain.connect(this.masterGain);

    const now = this.ctx.currentTime;
    // Envelope trigger
    noteGain.gain.setValueAtTime(0, now);
    noteGain.gain.linearRampToValueAtTime(0.3, now + 0.05); // Attack
    noteGain.gain.exponentialRampToValueAtTime(0.001, now + 1.2); // Decay/Release

    osc.start(now);
    osc.stop(now + 1.2);

    // Record active oscillator for memory stability verification
    this.activeOscillators.push({
      osc,
      noteGain,
      panner,
      stopTime: now + 1.2
    });
  }

  /**
   * Returns analyzer node for visuals synchronization.
   * @returns {AnalyserNode|null}
   */
  getAnalyserNode() {
    return this.analyser;
  }
}

// Map also to AudioEngine for layout compliance flexibility
export const AudioEngine = AudioSynthesizer;
