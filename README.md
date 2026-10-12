# Vibe Game

[![Web Audio](https://img.shields.io/badge/audio-Web%20Audio%20API-orange?style=for-the-badge&logo=javascript)](https://github.com/Prompt-0/vibe-game)
[![Canvas](https://img.shields.io/badge/graphics-HTML5%20Canvas%2060FPS-blue?style=for-the-badge&logo=html5)](https://github.com/Prompt-0/vibe-game)
[![Zero-Dependency](https://img.shields.io/badge/dependencies-zero%20external-success?style=for-the-badge)](https://github.com/Prompt-0/vibe-game)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue?style=for-the-badge)](LICENSE)

An interactive, browser-native ambient audio-visual sensory canvas and particle puzzle sandbox. Built using pure JavaScript (ES Modules), HTML5 Canvas, and the Web Audio API with zero external dependencies or heavy frontend frameworks.

---

## 🎨 Sensory Architecture & Features

- **Procedural Polyphonic Synthesizer**: Generates evolving harmonic soundscapes in real time using Web Audio oscillator nodes, biquad lowpass/highpass filters, gain envelopes, and algorithmic chord progressions.
- **Dynamic Particle Force Fields**: Hundreds of physics particles calculated at 60 FPS simulating gravitational attraction, fluid drag, spring damping, and velocity bursts driven by mouse and keyboard input.
- **Interactive Mood Themes**: Real-time shader-like canvas color gradients and audio scale shifts between distinct mood palettes:
  - **Zen / Ambient**: Gentle pentatonic scales with soft pastel fluid particles.
  - **Neon / Cyber**: Sawtooth harmonic sweeps with high-velocity luminous trails.
  - **Deep Space**: Sub-bass drones with slow orbital particle rings.
- **Accessibility & Zero-Latency**: Full keyboard and touch support with instant audio context unlocking and zero telemetry.

---

## 🕹️ Controls

| Input | Action |
| :--- | :--- |
| `Mouse Move` / `Touch` | Direct particle force field attraction |
| `Click` / `Space` | Emit resonant harmonic shockwave |
| `1` - `4` | Switch Mood / Color / Audio Themes |
| `M` | Toggle Audio Mute |

---

## 🚀 Getting Started

```bash
# Clone the repository
git clone https://github.com/Prompt-0/vibe-game.git
cd vibe-game

# Start local server
npm start
```

Visit `http://localhost:3000` (or the logged port) in your browser.

---

## 🧪 Validation

```bash
# Run syntax and module validation
npm test
```

---

## 📄 License
Licensed under the MIT License.
