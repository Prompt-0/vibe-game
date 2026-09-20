# Development Plan — Vibe Game

## Objectives
Build a visually stunning, highly optimized web game with no progression, upgrades, or objectives—focused entirely on music, environment, and "vibes".

## Technical Strategy
- **Framework & Libraries**: Let's run an initial explorer pass to see what environment we are in. Since it's greenfield, we can build a modern SPA. Vite is a fantastic, fast frontend tool. Let's see if Node/NPM/Vite are available. If not, pure HTML5 Canvas with modern ES Modules is extremely robust, simple, and dependency-free.
- **Audio System**: Web Audio API for synthesized, generative sounds and background soundscapes. No external audio files needed, which avoids assets loading issues. We can construct synthesizers, oscilators, nodes, and spatial pans dynamically.
- **Visuals System**: HTML5 Canvas (2D or WebGL) for responsive particle systems, ripples, custom canvas drawings depending on the theme.
- **Optimization**: Minimized layout shifts, optimized Largest Contentful Paint (LCP) via CSS/JS preload/resource-hints, zero memory leaks (proper event listener cleanup, canvas disposal).
- **Accessibility**: HTML5 controls or custom elements with proper ARIA and keyboard navigation (Tab, Arrow keys, Enter/Space).

## Milestones
1. **Milestone 1: Base Setup & Exploration**
   - Explore environment (Node.js/npm version, packages, browsers).
   - Set up project structure (HTML, JS, CSS, dev server configuration, test framework).
   - Verify basic CI command (testing and building).
2. **Milestone 2: Dual-Track E2E Test Suite Creation**
   - Create comprehensive E2E tests based on requirements (Tier 1-4).
   - Publish `TEST_READY.md` and define test runner command.
3. **Milestone 3: Graphics & Theming Implementation**
   - Create responsive fullscreen canvas.
   - Implement Theme Switcher UI (Keyboard accessible).
   - Implement 3 distinct visual themes: Nature (e.g. falling leaves/petals, tree ripples), Abstract (geometry, color-shifting, digital grid), Cosmic (starfield, nebula warp, black hole pull).
   - Interactive canvas visual feedback on mouse movement/clicks.
4. **Milestone 4: Audio Harmonizer Implementation**
   - Base ambient audio track (generative chord progression or smooth synth pads loop).
   - Mouse interactive sounds (triggering musical notes).
   - Chord harmonizer: mapping mouse cursor (X/Y coordinates) to musical notes in a scale (e.g., Pentatonic or Dorian) that harmonize with the background ambient pads.
5. **Milestone 5: Optimization & Accessibility Hardening**
   - Audit performance: LCP, CLS, FPS using chrome-devtools / browser subagent.
   - Audit memory leaks: Profile heap during continuous play and theme switching.
   - Audit accessibility: Ensure fully keyboard navigable UI with high contrast and screen reader friendliness.
   - Run adversarial testing (Tier 5) to verify correctness and robustness.
