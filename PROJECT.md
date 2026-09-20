# Project: Vibe Game

## Architecture
- A lightweight, responsive Single Page Application (SPA).
- **Core modules**:
  - `App`: Entry point, theme controller, orchestrator.
  - `CanvasEngine`: Canvas/WebGL drawing loops, theme rendering, responsive resizing.
  - `AudioSynthesizer`: Web Audio API sound synthesis, background ambient loops, interactive note generation, scale harmonizer.
  - `UI`: Theme switcher buttons and accessibility overlays.
- **Data Flow**:
  - User Inputs (mouse movements, clicks, keyboard events) -> Web Audio API & Canvas Engine.
  - Active Theme State -> Web Audio API & Canvas Engine to adjust colors, particles, speeds, and musical scales.
- **Interfaces**:
  - `setTheme(themeName)`: Swings visuals and audio settings to the selected theme.
  - `triggerInteraction(x, y)`: Invokes audio synthesis and registers interactive visual effects at normalized coordinates.

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| 1 | Base Setup & Exploration | Check environment, set up folder structure, dev server, and package configs. | None | DONE |
| 2 | E2E Test Suite | Design and build comprehensive opaque-box E2E test cases (Tiers 1-4). | M1 | DONE |
| 3 | Graphics & Theming | Implement full-screen responsive canvas, Theme UI, and 3 themes. | M1 | DONE |
| 4 | Audio Harmonizer | Implement generative ambient pads and interactive note/chord harmonizer. | M1, M3 | DONE |
| 5 | Optimization & Hardening | LCP, Memory Leak, A11y verification, Tier 5 testing. | M2, M3, M4 | DONE |

## Interface Contracts
### Graphics Engine ↔ Audio Engine
- Canvas registers interaction point: `Engine.interact(x, y)`.
- Audio triggers scale-mapped frequency based on `y` coordinate (frequency) and `x` coordinate (pan).
- Audio Synthesizer exposes active BPM/frequency nodes to allow visuals to sync (e.g. pulsing lights based on audio analysis node).

## Code Layout
- `index.html` - Base HTML shell
- `styles.css` - UI layout and themes stylesheet
- `src/` - App source files
  - `main.js` - Main entry
  - `graphics.js` - Graphics and canvas visual effects
  - `audio.js` - Web Audio synthesis & harmonizer
  - `ui.js` - Keyboards accessible UI controls
- `tests/` - Opaque-box E2E tests and test runner
