import { CanvasEngine } from './graphics.js';
import { AudioSynthesizer } from './audio.js';
import { UIController } from './ui.js';

let graphicsEngine = null;
let audioSynthesizer = null;
let uiController = null;

/**
 * Bootstraps the application by locating components and instantiating controllers.
 * @returns {Object} References to active engines and UI controller.
 */
export function initApp() {
  const canvas = document.getElementById('vibe-canvas');
  const playBtn = document.getElementById('play-pause-btn');
  const volumeControl = document.getElementById('volume-control');
  const themeButtons = document.querySelectorAll('.theme-btn');

  if (!canvas) {
    console.warn('Canvas element not found; deferring engine initialization.');
    return { graphics: null, audio: null, ui: null };
  }

  // 1. Initialize core engines
  graphicsEngine = new CanvasEngine(canvas);
  audioSynthesizer = new AudioSynthesizer();
  graphicsEngine.setAnalyser(audioSynthesizer.getAnalyserNode());

  // Set initial state
  const initialThemeBtn = document.querySelector('.theme-btn.active');
  const initialTheme = initialThemeBtn ? (initialThemeBtn.getAttribute('data-theme') || 'nature') : 'nature';
  graphicsEngine.setTheme(initialTheme);
  audioSynthesizer.setTheme(initialTheme);

  if (volumeControl) {
    audioSynthesizer.setVolume(parseFloat(volumeControl.value));
  }

  // 2. Wires components using the UI controller
  uiController = new UIController({
    canvas,
    playBtn,
    volumeControl,
    themeButtons,
    onThemeChange: (themeName) => {
      graphicsEngine.setTheme(themeName);
      audioSynthesizer.setTheme(themeName);
    },
    onPlayPause: (isPlaying) => {
      if (isPlaying) {
        graphicsEngine.start();
        audioSynthesizer.play();
        graphicsEngine.setAnalyser(audioSynthesizer.getAnalyserNode());
      } else {
        graphicsEngine.stop();
        audioSynthesizer.pause();
      }
    },
    onVolumeChange: (volumeVal) => {
      audioSynthesizer.setVolume(volumeVal);
    },
    onInteract: (x, y) => {
      graphicsEngine.triggerInteraction(x, y);
      audioSynthesizer.triggerInteraction(x, y);
      graphicsEngine.setAnalyser(audioSynthesizer.getAnalyserNode());
    }
  });

  return {
    graphics: graphicsEngine,
    audio: audioSynthesizer,
    ui: uiController
  };
}

// Automatically start when DOM is ready (in browser context)
if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    window.addEventListener('DOMContentLoaded', initApp);
  } else {
    // DOM already loaded
    initApp();
  }
}
