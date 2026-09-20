# E2E Test Infra: Vibe Game

## Test Philosophy
- Opaque-box, requirement-driven. No dependency on implementation design.
- Methodology: Category-Partition + BVA + Pairwise + Workload Testing.

## Feature Inventory
| # | Feature | Source (requirement) | Tier 1 | Tier 2 | Tier 3 |
|---|---------|---------------------|:------:|:------:|:------:|
| 1 | Fullscreen Rendering | R1, R3, AC1 | 5 | 5 | ✓ |
| 2 | Theme Selection | R1, AC2 | 5 | 5 | ✓ |
| 3 | Interactive Visuals | R1, R3, AC3 | 5 | 5 | ✓ |
| 4 | Ambient Audio | R2, AC4 | 5 | 5 | ✓ |
| 5 | Interactive Audio & Harmonizer | R2, AC5 | 5 | 5 | ✓ |
| 6 | Keyboard Accessibility | R4, AC6 | 5 | 5 | ✓ |
| 7 | Performance & Memory Stability | R4, AC7 | 5 | 5 | ✓ |

## Test Architecture
- Test runner: `tests/runner.html` and Node.js-based verification runner.
- Test case format: Script-based test definitions registered in `tests/runner.html`.
- Directory layout:
  - `tests/`
    - `runner.html` (browser integration test harness and spec executor)
    - `specs/` (individual test specs for features)
    - `run.js` (CLI command to run the headless browser verification)

## Real-World Application Scenarios (Tier 4)
| # | Scenario | Features Exercised | Complexity |
|---|----------|--------------------|------------|
| 1 | Casual Player Ambient Session | F1, F2, F4, F5 | Low |
| 2 | Rapid Performance Stress | F3, F5, F7 | High |
| 3 | Accessibility-Only Navigation | F2, F6 | Medium |
| 4 | Responsive Resize Vibe Check | F1, F3, F7 | Medium |
| 5 | Musical Harmonization Jam | F4, F5, F7 | High |

## Coverage Thresholds
- Tier 1: ≥5 per feature
- Tier 2: ≥5 per feature (where boundaries exist)
- Tier 3: pairwise coverage of major feature interactions
- Tier 4: ≥5 realistic application scenarios
