## 2026-07-03T19:34:17+05:30

You are teamwork_preview_worker. Fulfill Milestone 3: Graphics & Theming.
You need to implement the complete, high-quality visual rendering and interactive effects inside `src/graphics.js`.

Specifically, implement:
1. **Nature Theme**:
   - Background: Floating green/yellow pollen and leaf particles that drift upward and sway gently using sine waves.
   - Interactive Clicks: Expanding ripple rings that fade in opacity as they grow.
   - Mouse Movement: A trail of small, colorful drifting leaf/petal particles that shrink and fade out.
2. **Abstract Theme**:
   - Background: A slow-moving geometric grid or rotating wireframe background.
   - Interactive Clicks: Spinning squares, triangles, or polygons that scale down and explode outward.
   - Mouse Movement: Nodes that connect to adjacent trail nodes with thin lines when they are within a certain distance, forming a dynamic web.
3. **Cosmic Theme**:
   - Background: A moving multi-layered starfield showing stellar depth (parallax drifting stars).
   - Interactive Clicks: Starburst explosions (tiny glowing neon particle sprays) and a local warping effect.
   - Mouse Movement: Neon purple/blue glowing dust particles.

Ensure that:
- The canvas adapts perfectly to fullscreen resizing without any distortion or scale shifts.
- To prevent memory leaks, you MUST clean up old particles and interactions (e.g. filter out dead particles that have completed their animation or faded to zero opacity).
- The rendering runs smoothly inside the `loop` using `requestAnimationFrame`, maintaining 60 FPS.
- You do NOT hardcode any test results or bypass the tests. Ensure that all the existing unit tests in `tests/runner.html` pass.

Maintain your progress in `/home/ritesh/Projects/Active/Vibe Game/.agents/teamwork_preview_worker_m3/progress.md` with timestamps.
Save your handoff report to `/home/ritesh/Projects/Active/Vibe Game/.agents/teamwork_preview_worker_m3/handoff.md`.

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A Forensic Auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.
