# Codex Changelog

## 2026-06-22 — Import-boundary test path correction

- Moved the focused boundary regression suite to the standard, visible `tests/import-boundaries.test.ts` path.

## 2026-06-22 — Import-boundary enforcement correction

- Added the exact `ai` package to the forbidden `game-core` dependency list.
- Added focused regression coverage for `ai`, `@ai-sdk/openai`, and `@supabase/supabase-js` imports.

## 2026-06-22 — Import-boundary enforcement

- Added a focused TypeScript-aware checker for forbidden imports and browser globals under `src/game-core/`.
- Added tests covering allowed core imports, forbidden source layers, frameworks, providers, network modules, browser globals, and comment/string false positives.
- Added standalone and complete verification commands and documented the enforced core boundary.

## 2026-06-22 — Bare playable development loop

- Replaced the placeholder page with a one-shot client development view that initializes the minimal validated fixture.
- Added one structured doctrine-shift trigger wired directly to the existing deterministic resolver and rendered the returned state and causal `TurnResult` in compact debug panels.
- Added a pure structured-action constructor and focused unit test without introducing a browser-oriented component-test environment.
- Documented the UI-to-core boundary, current folder structure, and the slice's explicit limitations; the gameplay MVP remains unimplemented.

## 2026-06-22 — Minimal validated content fixture

- Added a separate `src/content/minimal/` area with exactly one provisional abstract playable archetype and one provisional abstract rival profile.
- Added small local validation for stable identifier namespaces, roles, required references, and documented numeric bounds.
- Added a validated `createMinimalInitialGameState()` initializer compatible with the existing doctrine-shift resolver.
- Added focused valid-content, invalid-content, state-initialization, stable-ID, and resolver-integration tests.
- Documented the implemented content boundary, temporary single-archetype rival origin, and deferred full schemas and catalogs.

## 2026-06-22 — Minimal deterministic doctrine shift

- Added a pure `shift_doctrine` resolver that immutably updates the first player ideology axis, clamps it to the positive bound, advances the turn, and appends a deterministic result reference to history.
- Added a structured `TurnResult` with one causal `StateChange` and narrow errors for unsupported actions, invalid actors, mismatched projects, and missing player ideology axes.
- Added focused tests for resolution, default intensity, immutability, repeatability, clamping, invalid inputs, and causal output.
- Documented the implemented simulation slice, its one-directional unsigned intensity assumption, and its deferred validation and pipeline limitations.

## 2026-06-22 — Core domain model skeleton

- Added framework-independent readonly TypeScript declarations for game state, projects, archetypes, ideology, institutions, factions, contradictions, external relations, rivals, structured actions, events, turn results, and endings.
- Added namespaced stable identifier types, documented numeric bound aliases, metric vocabularies, and structured causal references.
- Added representative compile-time fixtures and focused domain-barrel tests.
- Documented the implemented domain surface and deferred runtime validation, rules, content, and detailed action schemas.
- No simulation, gameplay consequences, content catalog, UI gameplay, or external integration implemented.

## 2026-06-22 — Project scaffold and developer baseline

- Added a minimal Next.js App Router application with strict TypeScript and a neutral early-development placeholder page.
- Added npm scripts and locked dependencies for development, linting, type-checking, unit tests, and production builds.
- Added ESLint and Vitest baselines with one trivial test proving the test runner works.
- Documented local setup, verification commands, and the initial web toolchain decision.
- No gameplay, domain model, integrations, persistence, or deployment automation implemented.

## 2026-06-22 — MVP roadmap initialized

- Added product epics and outcome-based milestones.
- Added a 30-task technical implementation sequence.
- Added the next five practical Codex tasks.
- Clarified architecture delivery order and deferred integrations.
- No application or gameplay implemented.

## 2026-06-22 — Repository harness initialized

- Added project operating rules.
- Added product docs.
- Added technical planning docs.
- Added Codex task workflow docs.
- No gameplay implemented.
