/**
 * UIController handles the DOM event listeners, keyboard accessibility (tab indexing,
 * ARIA roles, arrow key navigation), and routes user interactions to graphics and audio engines.
 */
export class UIController {
  /**
   * @param {Object} config
   * @param {HTMLCanvasElement} config.canvas - The interaction canvas
   * @param {HTMLButtonElement} config.playBtn - Play/Pause media button
   * @param {HTMLInputElement} config.volumeControl - Volume input range element
   * @param {NodeList|Array} config.themeButtons - List of theme switching radio buttons
   * @param {Function} config.onThemeChange - Callback for theme change
   * @param {Function} config.onPlayPause - Callback for play/pause toggle
   * @param {Function} config.onVolumeChange - Callback for volume change
   * @param {Function} config.onInteract - Callback for canvas interactions
   */
  constructor({
    canvas,
    playBtn,
    volumeControl,
    themeButtons,
    onThemeChange,
    onPlayPause,
    onVolumeChange,
    onInteract
  }) {
    this.canvas = canvas;
    this.playBtn = playBtn;
    this.volumeControl = volumeControl;
    this.themeButtons = Array.from(themeButtons);

    this.onThemeChange = onThemeChange || (() => {});
    this.onPlayPause = onPlayPause || (() => {});
    this.onVolumeChange = onVolumeChange || (() => {});
    this.onInteract = onInteract || (() => {});

    this.activeThemeIndex = 0;
    this.init();
  }

  /**
   * Initialises DOM listeners and sets up accessibility.
   */
  init() {
    // 1. Play / Pause Button Listener
    if (this.playBtn) {
      this.playBtn.addEventListener('click', () => this.handlePlayPause());
    }

    // 2. Volume Control Listener
    if (this.volumeControl) {
      this.volumeControl.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value);
        this.onVolumeChange(val);
      });
    }

    // 3. Theme Buttons Event & Key Listeners (Radio Group behaviour)
    this.themeButtons.forEach((btn, idx) => {
      // Click event
      btn.addEventListener('click', () => this.selectTheme(idx));

      // Keyboard navigation (Arrow keys within radio group)
      btn.addEventListener('keydown', (e) => this.handleThemeKeyDown(e, idx));

      // Make sure tabIndex is managed
      if (btn.classList.contains('active')) {
        btn.setAttribute('tabindex', '0');
        btn.setAttribute('aria-checked', 'true');
        this.activeThemeIndex = idx;
      } else {
        btn.setAttribute('tabindex', '-1');
        btn.setAttribute('aria-checked', 'false');
      }
    });

    // 4. Canvas Interactive Listeners
    if (this.canvas) {
      this.canvas.addEventListener('click', (e) => this.handleCanvasInteraction(e));
      this.canvas.addEventListener('touchstart', (e) => {
        if (e.touches && e.touches[0]) {
          this.handleCanvasInteraction(e.touches[0]);
        }
      }, { passive: true });
    }
  }

  /**
   * Handles play/pause toggles, updating accessibility states.
   */
  handlePlayPause() {
    if (!this.playBtn) return;
    const isPressed = this.playBtn.getAttribute('aria-pressed') === 'true';
    const newState = !isPressed;

    this.playBtn.setAttribute('aria-pressed', String(newState));
    this.playBtn.innerText = newState ? 'Pause' : 'Play';
    this.onPlayPause(newState);
  }

  /**
   * Selects a theme by index, modifying accessibility states and triggering changes.
   * @param {number} index
   */
  selectTheme(index) {
    if (index < 0 || index >= this.themeButtons.length) return;

    this.themeButtons.forEach((btn, idx) => {
      if (idx === index) {
        btn.classList.add('active');
        btn.setAttribute('aria-checked', 'true');
        btn.setAttribute('tabindex', '0');
        btn.focus();
        this.activeThemeIndex = idx;
        
        // Update document theme attribute for styles.css matching
        const themeName = btn.getAttribute('data-theme') || 'nature';
        document.documentElement.setAttribute('data-theme', themeName);
        this.onThemeChange(themeName);
      } else {
        btn.classList.remove('active');
        btn.setAttribute('aria-checked', 'false');
        btn.setAttribute('tabindex', '-1');
      }
    });
  }

  /**
   * Implements ARIA radiogroup keyboard navigation using arrow keys.
   * @param {KeyboardEvent} event
   * @param {number} index
   */
  handleThemeKeyDown(event, index) {
    let targetIdx = null;

    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      targetIdx = (index + 1) % this.themeButtons.length;
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      targetIdx = (index - 1 + this.themeButtons.length) % this.themeButtons.length;
    }

    if (targetIdx !== null) {
      event.preventDefault();
      this.selectTheme(targetIdx);
    }
  }

  /**
   * Normalises coordinate clicks/touches and bubbles up the interaction.
   * @param {MouseEvent|Touch} event
   */
  handleCanvasInteraction(event) {
    if (!this.canvas) return;
    const rect = this.canvas.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;

    // Constrain to [0, 1] range
    const nx = Math.max(0, Math.min(1, x));
    const ny = Math.max(0, Math.min(1, y));

    this.onInteract(nx, ny);
  }
}
