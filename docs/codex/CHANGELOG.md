# Codex Changelog

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
