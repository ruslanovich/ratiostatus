# MVP Epics

This roadmap groups product outcomes; it is not authorization to implement an entire epic in one task. Work should follow `docs/technical/IMPLEMENTATION_SEQUENCE.md` in small, independently verified changes.

## Epic 0 — Repository Harness and Project Discipline

**Status:** Completed.  
**Goal:** Establish durable product, architecture, and Codex operating sources of truth.  
**In scope:** Operating rules; product and technical specs; scope lock; maintenance workflow.  
**Out of scope:** Application code, gameplay, integrations, and deployment automation.  
**Dependencies:** None.  
**Deliverables:** `AGENTS.md`, `architecture.md`, and the initial `docs/` harness.  
**Acceptance criteria:** Required harness documents exist, agree on boundaries, and require ongoing maintenance.  
**Risks:** Documentation can drift unless every later task updates it.  
**Likely follow-up specs:** New subsystem specs and ADRs as implementation decisions become concrete.

## Epic 1 — Project Scaffold and Developer Baseline

**Goal:** Establish the smallest reliable development foundation.  
**In scope:** Next.js and TypeScript scaffold; package scripts; lint, test, and build baseline; Vercel-compatible build; minimal placeholder UI.  
**Out of scope:** Simulation, content systems, LLMs, Supabase, and persistence.  
**Dependencies:** Epic 0.  
**Deliverables:** Runnable app shell, documented commands, baseline automated checks.  
**Acceptance criteria:** A clean checkout can install dependencies and pass documented lint, test, and production-build commands; the placeholder page contains no gameplay claims.  
**Risks:** Framework defaults can blur `app`, `ui`, and `game-core` boundaries or add unnecessary services.  
**Likely follow-up specs:** Toolchain decision record, repository layout, import-boundary enforcement.

## Epic 2 — Core Domain Model

**Goal:** Define stable, validated vocabulary for the deterministic core.  
**In scope:** `GameState`, `CivilizationalProject`, `Archetype`, `IdeologyProfile`, `Institution`, `Faction`, `Contradiction`, `ExternalRelation`, `RivalProject`, `PlayerAction`, `AIAction`, `EventCard`, `TurnResult`, and `Ending`; identifiers and numeric bounds.  
**Out of scope:** UI polish, LLMs, Supabase, turn effects, and balancing.  
**Dependencies:** Epic 1 and `DOMAIN_MODEL.md`.  
**Deliverables:** Domain types, boundary validators, representative fixtures, and tests.  
**Acceptance criteria:** Valid fixtures pass, malformed identifiers and out-of-bound values fail, and domain modules have no UI or infrastructure imports.  
**Risks:** Prematurely detailed types may encode untested game design.  
**Likely follow-up specs:** Numeric bounds, state invariants, action schema, versioning policy.

## Epic 3 — Deterministic Turn Simulation

**Goal:** Resolve one small turn without UI complexity.  
**In scope:** Validate and apply one player action; update initial metrics, factions, contradictions, and external relations; produce a causal `TurnResult`; deterministic tests.  
**Out of scope:** Rich content, LLMs, advanced rival AI, visual maps, and a complete game.  
**Dependencies:** Epic 2.  
**Deliverables:** Pure turn-resolver API, minimal rules, fixtures, and repeatability/invariant tests.  
**Acceptance criteria:** Identical inputs produce deeply equal outputs; input state is not mutated; results stay bounded and valid.  
**Risks:** Rule ordering or hidden randomness can undermine determinism.  
**Likely follow-up specs:** Turn phase ordering, rule composition, causal explanation model.

## Epic 4 — Archetypes and Initial Content

**Goal:** Supply enough validated abstract content for distinct starting positions.  
**In scope:** Five to six archetypes; initial ideology profiles, institutions, factions, and rival setups; schema validation.  
**Out of scope:** Real-world analogues, final naming, exhaustive events, and full balancing.  
**Dependencies:** Epics 2–3 and `CONTENT_MODEL.md`.  
**Deliverables:** Versioned content schemas, initial content files, validation command, and tests.  
**Acceptance criteria:** Every entry validates, uses stable identifiers, initializes legal state, and remains fully abstract.  
**Risks:** Quantity can outpace mechanical distinction; provisional labels may be mistaken for final identity.  
**Likely follow-up specs:** Archetype authoring guide, content vocabulary, content review checklist.

## Epic 5 — Player Actions

**Goal:** Make the intended ideological choices available as structured manual actions.  
**In scope:** Action cards and schemas for shift doctrine, build/reform institution, reinterpret crisis, define enemy, make compromise, suppress faction, empower faction, export ideology, and seek détente.  
**Out of scope:** Free-text parsing, LLM calls, final UI polish, and consequences outside core rules.  
**Dependencies:** Epics 2–4.  
**Deliverables:** Action catalog, legality validation, deterministic rule handlers, tests, and concise descriptions.  
**Acceptance criteria:** Every action can be constructed manually, rejected when illegal, and resolved through the same core entry point.  
**Risks:** Actions may overlap or encode outcomes instead of intent.  
**Likely follow-up specs:** Action legality matrix, targeting rules, action-cost model.

## Epic 6 — Faction and Internal Politics System

**Goal:** Make the player's society internally plural and reactive.  
**In scope:** Bounded faction power, support, loyalty, visibility, and radicalization; conflict channels; reactions; suppressed opposition; internal crisis triggers.  
**Out of scope:** Full parliament simulation, real parties, interpersonal leader simulation, and unbounded procedural politics.  
**Dependencies:** Epics 2, 3, and 5.  
**Deliverables:** Faction rules, reaction summaries, crisis eligibility, and invariant tests.  
**Acceptance criteria:** Relevant actions produce explainable faction changes; suppression has delayed costs; faction state remains legal.  
**Risks:** Too many metrics can obscure decisions or create unstable feedback loops.  
**Likely follow-up specs:** Faction state machine, conflict-channel rules, internal crisis catalog.

## Epic 7 — External Relations and AI Rivals

**Goal:** Make three rival projects react, compete, and evolve autonomously.  
**In scope:** Three AI rivals; ideological distance, threat perception, influence, war pressure, ideological drift, structured rival actions, deterministic selection.  
**Out of scope:** Tactical war, random global shocks, real-world diplomacy, and model-driven AI.  
**Dependencies:** Epics 2–5; integrates with Epic 6.  
**Deliverables:** Rival policy rules, relation updates, AI action reports, and deterministic tests.  
**Acceptance criteria:** All three rivals act from their own state, evolve across turns, and produce reproducible, explainable results.  
**Risks:** Predictability can become trivial; opaque heuristics can feel arbitrary.  
**Likely follow-up specs:** Rival decision policy, ideological distance formula, war-pressure outcomes.

## Epic 8 — Event and Contradiction System

**Goal:** Turn state pressure into readable crises, opportunities, and forecasts.  
**In scope:** Event and contradiction templates, explicit causes and effects, tracker state, escalation, and forecast hints.  
**Out of scope:** Random global shocks, LLM-generated events, and rules hidden in prose.  
**Dependencies:** Epics 3–7.  
**Deliverables:** Eligibility/resolution pipeline, initial templates, causal references, and tests.  
**Acceptance criteria:** Events derive from current state, are deterministic under equal inputs, and explain triggering causes.  
**Risks:** Repetition, event cascades, and forecasts that reveal too much or too little.  
**Likely follow-up specs:** Event priority rules, contradiction lifecycle, forecast disclosure policy.

## Epic 9 — Playable Game Loop

**Goal:** Deliver a complete 10–12 turn session from selection to ending.  
**In scope:** Choose archetype, initialize player and three rivals, take structured actions, resolve turns, view reports, reach an ending, and restart in memory.  
**Out of scope:** Save/load/replay, accounts, multiplayer, LLM input, and production deployment.  
**Dependencies:** Epics 2–8.  
**Deliverables:** Session controller, turn progression, ending evaluation, restart flow, and end-to-end tests.  
**Acceptance criteria:** A complete deterministic session runs without network or persistence and reaches a valid ending by rule.  
**Risks:** Integrating systems late may expose state-contract and pacing problems.  
**Likely follow-up specs:** Session lifecycle, ending catalog, restart and initialization rules.

## Epic 10 — MVP UI / Situation Room

**Goal:** Make the playable loop quickly readable and visually causal.  
**In scope:** Situation Room, Ideology Panel, Faction Map, External Relations Map, Contradiction Tracker, Historical Timeline, and Turn Report.  
**Out of scope:** Mobile-specific UI, final branding, heavy animation, and text-wall gameplay.  
**Dependencies:** Epic 9 and `UI_SPEC.md`; simple UI work may begin earlier against fixtures.  
**Deliverables:** Structured action UI, responsive desktop layouts, visual state views, accessible drill-down, and component tests.  
**Acceptance criteria:** A player can identify major changes, risks, and causes within 10–20 seconds and complete the loop without free text.  
**Risks:** Visual polish may hide weak information hierarchy or couple UI directly to mutable core state.  
**Likely follow-up specs:** Screen wireframes, visual tokens, accessibility and responsive behavior.

## Epic 11 — Testing and Balancing Harness

**Goal:** Make the game safe to change and practical to tune.  
**In scope:** Unit, determinism, bounds, invariant, scripted-game, and regression tests; future simulation-runner design; eventual automated multi-game balance checks.  
**Out of scope:** Analytics collection, production telemetry, and balance by hidden nondeterminism.  
**Dependencies:** Begins with Epic 2 and expands through Epics 3–10.  
**Deliverables:** Test suites, canonical fixtures, headless runner, balance reports, and documented commands.  
**Acceptance criteria:** Core rules have proportional coverage; scripted sessions remain valid; multi-game checks can flag saturation, dead actions, and unreachable endings.  
**Risks:** Brittle snapshot tests or tuning to synthetic agents rather than player experience.  
**Likely follow-up specs:** Simulation runner contract, balancing metrics, regression-fixture policy.

## Epic 12 — LLM Semantic Adapter

**Status:** Post-core and optional for MVP unless explicitly promoted.  
**Goal:** Optionally translate free text into existing structured actions.  
**In scope:** Compact input, strict structured output, schema validation, confidence threshold, and manual fallback.  
**Out of scope:** Consequence calculation, state mutation, core dependency, game-master behavior, and required connectivity.  
**Dependencies:** Stable Epic 5 action schema and a validated manual loop from Epic 9.  
**Deliverables:** Isolated adapter, validator integration, fallback UX, safety tests, and cost/latency notes.  
**Acceptance criteria:** Disabling the adapter leaves the full game playable; invalid or uncertain output never enters the core.  
**Risks:** Nondeterminism, latency, cost, data handling, and user over-trust.  
**Likely follow-up specs:** Provider choice, prompt/schema versioning, privacy and evaluation plan.

## Epic 13 — Vercel Development Deployment

**Goal:** Make development and preview builds deploy cleanly to Vercel.  
**In scope:** Build compatibility, environment-variable documentation, preview assumptions, and deployment smoke checks.  
**Out of scope:** Production hardening, VPC migration, analytics, databases, and coupling `game-core` to Vercel.  
**Dependencies:** Epic 1; beta deployment follows the stable integrated build.  
**Deliverables:** Documented Vercel configuration and verified preview build.  
**Acceptance criteria:** The app builds and starts in a Vercel preview environment with no undocumented secrets or production URLs.  
**Risks:** Platform-specific code may leak into core or premature automation may add maintenance.  
**Likely follow-up specs:** Environment matrix, deployment runbook, future VPC migration constraints.

## Epic 14 — Supabase Persistence

**Status:** Deferred; not MVP.  
**Goal:** Add persistence only if validated product needs justify it.  
**In scope:** Nothing in MVP. Potential future work includes authentication, saved games, replay, user-generated scenarios, and telemetry, each requiring separate approval and privacy design.  
**Out of scope:** All current MVP development and any direct `game-core` dependency.  
**Dependencies:** Explicit product decision after core validation; stable serialization boundaries.  
**Deliverables:** Future ADR, data model, adapter boundary, migrations, security policy, and tests.  
**Acceptance criteria:** Not defined until promoted; deferral remains the current acceptance condition.  
**Risks:** Scope expansion, privacy/security obligations, vendor coupling, and premature state contracts.  
**Likely follow-up specs:** Persistence requirements, threat model, data lifecycle, migration and replay contracts.

## Epic 15 — Beta Readiness

**Goal:** Prepare the MVP for a small external beta.  
**In scope:** Onboarding, focused UX polish, terminology review, basic content pass, bug fixes, accessibility checks, and playtest checklist.  
**Out of scope:** Final branding, broad marketing launch, production analytics, persistence, and unrelated feature expansion.  
**Dependencies:** Epics 1–11 and a Vercel preview from Epic 13; Epic 12 is not required.  
**Deliverables:** Beta candidate, known-issues list, playtest protocol, feedback questions, and terminology candidates.  
**Acceptance criteria:** New testers can start, complete, and understand a session; blocking defects are resolved; provisional naming is ready for feedback.  
**Risks:** Polishing before core comprehension and balance are validated; beta feedback may expose identity changes.  
**Likely follow-up specs:** Beta feedback synthesis, naming decision, release criteria, post-MVP roadmap.
