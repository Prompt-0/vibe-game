# Original User Request

## 2026-07-03T13:45:20Z

# Teamwork Project Prompt — Draft

> Status: Launched
> Goal: Craft prompt → get user approval → delegate to teamwork_preview

A visually stunning, highly optimized web game with no progression, upgrades, or objectives—focused entirely on music, environment, and "vibes". It should be responsive across multiple screen sizes.

Working directory: /home/ritesh/Projects/Active/Vibe Game
Integrity mode: development

## Requirements

### R1. Core Experience & Themes
Create an interactive, endless, and objective-less environment where the primary interaction drives visual and auditory feedback. Provide multiple visual themes (e.g., serene nature, futuristic abstract, cosmic journey) that the player can switch between to change the pace and vibe.

### R2. Audio Experience
Implement a mix of relaxing background ambient tracks and interactive sound effects, where user interactions (like cursor movements or clicks) create harmonious notes that blend with the background music.

### R3. Visual Aesthetics & Polish
Implement a modern, premium aesthetic (using tools like Three.js for WebGL or advanced Canvas/CSS animations) that adapts seamlessly to all screen sizes. The visuals must look exceptionally high-quality and dynamic.

### R4. Performance Optimization, A11y, and Debugging
Ensure the application maintains a consistent 60 FPS, with optimized Largest Contentful Paint (LCP) and no memory leaks, leveraging modern web APIs. The UI (e.g., theme switcher) must be accessible. The team MUST use the `a11y-debugging`, `debug-optimize-lcp`, and `memory-leak-debugging` skills, as well as the `browser` subagent to verify these properties.

## Acceptance Criteria

### Interaction and Theming
- [ ] The app renders a visually striking full-screen canvas or WebGL context.
- [ ] A UI element exists to cycle through at least 3 distinct themes (e.g., nature, abstract, cosmic).
- [ ] Mouse movements or clicks produce visible on-screen effects (e.g., ripples, particles) and audible harmonious notes.

### Audio
- [ ] Background ambient music plays continuously (can be generative or a loop).
- [ ] Interactive sound effects trigger on user input and harmonize with the background audio.

### Performance and Quality
- [ ] The `browser` subagent confirms there are no layout shifts or LCP bottlenecks (using the `debug-optimize-lcp` skill).
- [ ] The `memory-leak-debugging` skill confirms there are no runaway memory leaks during continuous play or theme switching.
- [ ] The `a11y-debugging` skill confirms the UI controls are accessible via keyboard.
