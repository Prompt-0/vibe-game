# Test Suite Readiness: Vibe Game

This project contains a comprehensive, offline-compatible E2E integration test suite for the Vibe Game application.

## Test Runner Locations & Command

To run the integration tests:
1. **Dev Server Method**:
   - Start the local development server:
     ```bash
     npm start
     ```
   - Open your web browser and navigate to:
     [http://localhost:8000/tests/runner.html](http://localhost:8000/tests/runner.html)

2. **Direct Filesystem Method (Offline)**:
   - Double-click or open `tests/runner.html` directly in any modern web browser.

## Test Suite Execution Details
- **Total Test Cases**: 82
- **Success Criteria**: 82 / 82 PASS
- **Test Framework**: Zero-dependency browser-based test harness built directly in `tests/runner.html`.
- **Mocks & Stubs**:
  - Full stub implementation of Web Audio API (`AudioContext`, `GainNode`, `OscillatorNode`, `AnalyserNode`, `StereoPannerNode`).
  - Mocked window dimensions and resize dispatcher.
  - HTMLCanvasElement 2D rendering context stub.

## Test Coverage Breakdown

### Tier 1: Feature Coverage (35 Tests)
- **F1: Fullscreen Canvas Rendering**: 5 tests checking initialization, scaling, resize listening, context setup, and default render.
- **F2: Theme Selection**: 5 tests checking theme change synchronization on CanvasEngine/AudioSynthesizer, ARIA/Tabindex updates, and document data-theme binding.
- **F3: Interactive Visuals**: 5 tests checking interact method, event bubbling, interaction logging, boundary mapping, and render loop processing.
- **F4: Ambient Audio**: 5 tests checking default pause, playback resume, suspend context, default volume, and master gain adjustment.
- **F5: Interactive Audio & Harmonizer**: 5 tests checking scale note pitch mapping, spatial panning, oscillator/gain instantiation, wave type theme mappings, and routing graph connections.
- **F6: Keyboard Accessibility**: 5 tests checking focus states, arrow key navigation (ArrowRight/ArrowLeft/ArrowDown/ArrowUp), and focus ring behavior.
- **F7: Performance & Memory Stability**: 5 tests checking requestAnimationFrame loops, cancelAnimationFrame cleanups, event listener removals, LCP rendering parameters, and oscillator pruning.

### Tier 2: Boundary & Corner Cases (35 Tests)
- **F1: Fullscreen Canvas Rendering**: 5 tests checking error throwing on null arguments, zero dimensions clamping, massive viewport sizes (8000x8000), devicePixelRatio, and rapid resize handling.
- **F2: Theme Selection**: 5 tests checking negative indexes, overflow indexes, unknown themes on synth/canvas, and rapid theme toggling state stability.
- **F3: Interactive Visuals**: 5 tests checking exact bounds (0,0)/(1,1) coordinate mapping, out-of-bounds coordinates clamping, high density event queues (200 interactions), and multi-touch event prioritization.
- **F4: Ambient Audio**: 5 tests checking negative volume clamping, overflow volume clamping, play/pause double-invocation safety, and context suspension state handling.
- **F5: Interactive Audio & Harmonizer**: 5 tests checking scale bounds notes mappings, extreme panning bounds, StereoPanner fallback support, and notes-per-second stress test (100 simultaneous notes).
- **F6: Keyboard Accessibility**: 5 tests checking ArrowRight/ArrowLeft keyboard wraps, invalid key filters, Tab key default behavior, and empty button list handling.
- **F7: Performance & Memory Stability**: 5 tests checking hidden visibilityState, muted volume silent-scheduling, visual decay over time, completed oscillator garbage collection, and variable frame render stability.

### Tier 3: Cross-Feature Interactions (7 Tests)
- **X-1**: Theme switching updates both visual canvas styles and musical scales simultaneously.
- **X-2**: Play/Pause button toggles both Canvas rendering frame loop and Ambient synthesizer playback.
- **X-3**: Interactive clicks draw visual ripple effects and trigger audio notes simultaneously.
- **X-4**: Volumebar inputs adjust master gain node immediately.
- **X-5**: Viewport resizing updates canvas dimensions and maps pixel coordinate inputs correctly.
- **X-6**: Pitch frequency maps to different notes of the scale based on the selected theme.
- **X-7**: Canvas rendering loop queries active synthesizer AnalyserNode data.

### Tier 4: Real-World Application Scenarios (5 Tests)
- **S-1: Casual Player Ambient Session**: Simulates playing, clicking notes, changing volume, and switching theme with full application flow via `initApp()`.
- **S-2: Rapid Performance Stress**: Simulates clicking rapidly 50 times and switching themes 3 times.
- **S-3: Accessibility-Only Navigation**: Simulates focus shifts, keyboard arrow keys selection, and spacebar media toggles.
- **S-4: Responsive Resize Vibe Check**: Simulates canvas width/height scaling from 800x600 to 1920x1080 and verifies coordinate maps.
- **S-5: Musical Harmonization Jam**: Simulates left/right extreme clicks and pitch scale mapping under Nature and Cosmic themes.
