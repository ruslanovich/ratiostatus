# Codex Changelog

## 2026-06-22 — Five starting archetypes

- Expanded the minimal content layer to a readonly catalog of five mechanically distinct abstract starting archetypes while retaining the original provisional civic compact as the deterministic default.
- Added catalog lookup and archetype-specific state initialization with clear unknown-ID rejection, the unchanged provisional rival, content validation, and final core `GameState` validation.
- Added focused uniqueness, bounds, required metric shape, local reference integrity, mechanical-variety, per-archetype initialization, default determinism, and scripted-session compatibility coverage.
- Documented the catalog shape, provisional abstract naming, content/core boundary, validation behavior, and deferred selection UI, rival expansion, gameplay rules, and balancing.

## 2026-06-22 — Scripted ten-turn headless session

- Added a pure content-independent session runner that validates an initial state, applies ordered player actions through `resolveTurn`, and returns the initial state, final state, and ordered turn results without mutating inputs.
- Added a minimal-content helper with ten stable magnitude-10 doctrine shifts that completes at turn ten with exact ordered history references.
- Added deterministic, immutability, validation, resolver-error propagation, per-turn causal-change, sequential-turn, and final-state regression coverage.
- Documented the new core session boundary and content-owned fixture while keeping non-shift consequences, rival actions, events, endings, persistence, UI lifecycle, and balancing deferred.

## 2026-06-22 — Minimal deterministic project metric derivation

- Implemented `update_project_metrics` as a pure post-action phase for doctrine shifts, with placeholder one-point mobilization and inverse legitimacy changes clamped to `0..100`.
- Appended action-caused mobilization and legitimacy entries after the existing doctrine-axis `StateChange` while leaving the direct doctrine resolver narrow.
- Updated the bare development-loop result panel to render every core-returned change without calculating or predicting consequences in the UI.
- Added focused increase, decrease, clamping, causality, direct-resolver isolation, no-op preservation, determinism, immutability, and validation coverage.
- Documented the metric-only Task 3.3 scope and kept faction, contradiction, relation, rival, event, ending, and non-shift consequences deferred.

## 2026-06-22 — Manual development-loop action options

- Replaced the single hardcoded doctrine-shift constructor with a pure state-derived manual action-option model containing enabled increase/decrease shifts and disabled institution/détente placeholders.
- Kept every option structurally valid, made missing-axis shifts explicitly unavailable, and added a UI resolver gate that cannot submit disabled options.
- Updated the bare development loop to render option labels, descriptions, disabled reasons, and one-shot enabled controls while preserving its core-returned debug result panel.
- Added focused option-generation, validation, missing-axis, bidirectional resolution, and disabled-submission tests without adding non-shift consequences or browser test infrastructure.
- Aligned the implementation sequence so this assigned UI contract is Task 5.2 and deferred consequence handlers remain later Epic 5 tasks.

## 2026-06-22 — Detailed player action schemas

- Replaced generic optional action intensity with a nine-kind discriminated action catalog and required kind-specific parameter objects for player and rival structured actions.
- Added runtime validation for every parameter ID namespace, enum, and doctrine-shift magnitude bound without adding gameplay-legality rules or non-shift consequences.
- Updated doctrine shift to select an axis by ID, increase or decrease by explicit magnitude, clamp to `-100..100`, and preserve immutable deterministic output.
- Migrated the bare development loop and fixtures, added focused schema and resolver coverage, and aligned domain, simulation, testing, gameplay-loop, architecture, UI, and future LLM contract documentation.

## 2026-06-22 — Ordered turn phases

- Added a fixed, typed eleven-phase turn sequence and a pure `resolveTurn` entrypoint that executes every phase in order.
- Routed the existing doctrine-shift behavior through the player-action phase while keeping future metrics, factions, contradictions, relations, rivals, events, endings, and result-assembly phases as explicit no-ops.
- Updated the bare development loop to call the shared turn entrypoint and added focused ordering, equivalence, determinism, non-mutation, no-op preservation, rejection, and validation tests.
- Documented the implemented pipeline, current no-op phases, public simulation boundary, and testing obligations without adding gameplay rules.

## 2026-06-22 — Domain validation and numeric bounds

- Added public runtime assertions for stable ID format, percentage and signed-percentage bounds, turn ranges, projects, game state, player actions, and turn results.
- Integrated state validation into minimal initialization and input/output validation into the doctrine-shift resolver, including normalized deterministic result and state-field IDs.
- Reused generic bound and ID assertions from minimal content validation and added focused invalid-boundary coverage without introducing gameplay or balancing rules.
- Updated the domain, simulation, content, testing, and architecture documentation to distinguish implemented validation from deferred detailed schemas and referential integrity.

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
