# Implementation Sequence

This order decomposes the epics into small Codex-sized tasks. Task IDs identify their owning epic; document order is the recommended execution order. Each task must update relevant tests and harness docs and should be independently reviewable.

## Task 1.1 — Create Next.js TypeScript scaffold

**Depends on:** Completed harness.  
**Output:** Minimal Next.js/TypeScript app, package scripts, placeholder page, and passing documented lint, unit-test, and production-build commands.  
**Do not do:** Add gameplay, state models, LLMs, Supabase, persistence, or deployment automation.

## Task 2.1 — Define domain type skeletons

**Depends on:** Task 1.1.  
**Output:** Core domain files for the concepts in `DOMAIN_MODEL.md`, stable identifiers, and compile-time fixtures; no rules.  
**Do not do:** Guess detailed formulas, build UI state, or import framework/browser modules into `game-core`.

## Task 3.1 — Resolve one minimal deterministic action

**Depends on:** Task 2.1.  
**Output:** Pure resolver for one bounded doctrine-shift action, immutable result, causal delta, and repeatability tests.  
**Do not do:** Build a general rules engine, complete turn pipeline, rival AI, or events.

## Task 4.1 — Add minimal validated content fixture

**Depends on:** Tasks 2.1 and 3.1.  
**Output:** Content schema plus one provisional archetype and one provisional rival that initialize legal state; validation tests.  
**Do not do:** Add the full content set, real-world analogues, or final names.

## Task 9.1 — Add a bare playable development loop

**Depends on:** Tasks 3.1 and 4.1.  
**Output:** Minimal page or terminal-like development view that initializes the fixture, submits the one structured action, and displays its `TurnResult`.  
**Do not do:** Add visual polish, multiple turns, client-owned consequence logic, persistence, or free text.

## Task 1.2 — Enforce import boundaries and harden checks

**Depends on:** Task 1.1; incorporate files from Tasks 2.1–9.1 if present.  
**Output:** Type-check coverage and an enforceable or tested rule preventing forbidden core imports, integrated with the baseline checks.  
**Do not do:** Add CI/CD, hosting configuration, analytics, or broad toolchain churn.

## Task 2.2 — Add domain validation and numeric bounds

**Depends on:** Task 2.1.  
**Output:** Runtime validation at core boundaries, documented bounds, valid/invalid fixtures, and focused tests.  
**Do not do:** Encode turn consequences or content-specific balance coefficients.

## Task 3.2 — Define ordered turn phases

**Depends on:** Tasks 3.1 and 2.2.  
**Output:** Explicit pure pipeline for player action, metrics, factions, contradictions, relations, rivals, events, validation, and ending checks, with empty/no-op phase adapters where rules do not yet exist.  
**Do not do:** Hide ordering in side effects, introduce randomness, or fill every phase with speculative logic.

## Task 3.3 — Implement minimal state-system updates

**Depends on:** Task 3.2.  
**Output:** Small documented rules for bounded project metrics, one faction reaction, one contradiction, and one external-relation update, with causal and invariant tests.  
**Do not do:** Implement complete internal politics, event catalogs, advanced AI, war resolution, or production balancing.

## Task 9.2 — Add scripted 10-turn headless session

**Depends on:** Tasks 3.2–3.3 and 4.1.  
**Output:** In-memory session runner using a fixed legal action sequence, turn count, history, and deterministic regression test.  
**Do not do:** Add save/load, replay files, ending variety, or UI polish.

## Task 4.2 — Expand to five or six starting archetypes

**Depends on:** Stable schemas from Task 4.1 and state rules from Task 3.3.  
**Output:** Mechanically distinct abstract archetypes with initial ideology, institutions, and factions; all content validates.  
**Do not do:** Use direct real-world mappings, finalize identity terminology, or add flavor without mechanical purpose.

## Task 4.3 — Add three validated rival setups

**Depends on:** Task 4.2.  
**Output:** Three abstract rival profiles and deterministic session initialization rules for player/rival combinations.  
**Do not do:** Implement AI action selection or tactical conflict.

## Task 5.1 — Define the complete structured action catalog

**Depends on:** Tasks 2.2 and 4.2.  
**Output:** Discriminated schemas, targets, parameters, and legality validation for all nine MVP action types.  
**Do not do:** Put consequences in action payloads, add free-text parsing, or build final action-card visuals.

## Task 5.2 — Add the manual action option model

**Depends on:** Tasks 3.2 and 5.1.  
**Output:** A small state-derived manual UI option contract with enabled doctrine-shift choices and structurally valid disabled placeholders for unsupported action kinds.
**Do not do:** Add non-shift consequences, broad legality rules, a full action catalog UI, or final visual polish.

## Task 5.3 — Implement doctrine, institution, and crisis actions

**Depends on:** Tasks 3.2, 5.1, and 5.2.
**Output:** Deterministic handlers and tests for doctrine shift, build/reform institution, and reinterpret crisis.  
**Do not do:** Implement the remaining actions or bypass shared resolution phases.

## Task 5.4 — Implement faction-directed actions

**Depends on:** Tasks 3.3, 5.1, and 5.3.
**Output:** Deterministic handlers and tests for compromise, suppress faction, empower faction, and define enemy where internally targeted.  
**Do not do:** Complete faction dynamics or encode UI messages in rules.

## Task 5.5 — Implement external actions

**Depends on:** Tasks 3.3, 5.1, and 5.4.
**Output:** Deterministic handlers and tests for export ideology, seek détente, and externally targeted define-enemy actions.  
**Do not do:** Add rival AI, tactical war, or network behavior.

## Task 6.1 — Add bounded faction dynamics

**Depends on:** Tasks 3.3 and 5.4.
**Output:** Power, support, loyalty, visibility, and radicalization updates with explicit bounds and causal explanations.  
**Do not do:** Add leaders, full parliament simulation, or unbounded metric coupling.

## Task 6.2 — Add conflict channels and suppression consequences

**Depends on:** Task 6.1.  
**Output:** Conflict-channel rules, delayed suppressed-opposition pressure, and internal crisis eligibility with scenario tests.  
**Do not do:** Generate final event cards or rely on random crises.

## Task 7.1 — Define deterministic rival decision policy

**Depends on:** Tasks 4.3 and 5.5.
**Output:** Explainable scoring/priority policy that selects a legal structured `AIAction`, with tie-breaking and determinism tests.  
**Do not do:** Use an LLM, hidden randomness, or direct state mutation.

## Task 7.2 — Add ideological distance and rival evolution

**Depends on:** Task 7.1.  
**Output:** Bounded ideological distance, threat, influence, war pressure, and ideological drift rules for three rivals.  
**Do not do:** Resolve tactical wars or model real-world blocs.

## Task 8.1 — Define contradiction and event template schemas

**Depends on:** Tasks 3.3, 6.2, and 7.2.  
**Output:** Validated templates with eligibility, cause references, forecast hints, and structured effect identifiers.  
**Do not do:** Put executable rules in prose or add global random shocks.

## Task 8.2 — Implement deterministic event selection and resolution

**Depends on:** Task 8.1.  
**Output:** State-derived priority selection, deterministic tie-breaking, resolution through core rules, and causal tests.  
**Do not do:** Generate event text with an LLM or let content mutate state directly.

## Task 9.3 — Complete session lifecycle and endings

**Depends on:** Tasks 5.5, 7.2, and 8.2.
**Output:** Archetype selection, three-rival initialization, 10–12 turn progression, deterministic ending evaluation, in-memory restart, and end-to-end tests.  
**Do not do:** Add save/load/replay, authentication, persistence, or multiplayer.

## Task 10.1 — Build Situation Room and structured action flow

**Depends on:** Task 9.3; may prototype against fixtures earlier.  
**Output:** Situation overview, event/action cards, manual action construction, turn submission, and primary causal report.  
**Do not do:** Recalculate consequences in UI, require free text, or chase final visual branding.

## Task 10.2 — Build ideology, faction, and contradiction views

**Depends on:** Task 10.1 and stable outputs from Epics 5, 6, and 8.  
**Output:** Ideology Panel, Faction Map, and Contradiction Tracker with drill-down and component tests.  
**Do not do:** Replace causal visuals with raw tables or add mobile-specific layouts.

## Task 10.3 — Build external map, timeline, and full turn report

**Depends on:** Task 10.2 and stable rival outputs.  
**Output:** Abstract External Relations Map, Historical Timeline, and ranked Turn Report that expose causes and risk.  
**Do not do:** Use a real-world map, add long unstructured logs, or couple components to core internals.

## Task 11.1 — Add scripted games and invariant regression suite

**Depends on:** Task 9.3.  
**Output:** Representative full-session fixtures testing determinism, bounds, valid states, action reachability, and endings.  
**Do not do:** Treat snapshots as a substitute for rule-level assertions.

## Task 11.2 — Add headless multi-game balancing runner

**Depends on:** Task 11.1.  
**Output:** Local deterministic runner and aggregate report for ending distribution, saturation, dead actions, and invalid states.  
**Do not do:** Add production analytics, telemetry, or nondeterministic agents.

## Task 13.1 — Verify Vercel development preview

**Depends on:** Stable build from Tasks 1.2 and 10.3.  
**Output:** Minimal Vercel-compatible configuration if needed, environment documentation, preview smoke test, and no core platform coupling.  
**Do not do:** Add production hardening, VPC automation, Supabase, or hardcoded URLs.

## Task 15.1 — Prepare private beta candidate

**Depends on:** Tasks 11.2 and 13.1.  
**Output:** Onboarding, terminology review, targeted content/UX fixes, accessibility check, known issues, and playtest checklist.  
**Do not do:** Finalize naming without feedback, add analytics, or expand MVP scope.

Epic 12 receives no implementation task until an explicit post-core promotion decision. Epic 14 has no implementation tasks because Supabase persistence is deferred beyond MVP.
