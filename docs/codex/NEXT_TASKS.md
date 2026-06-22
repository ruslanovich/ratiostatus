# Next Codex Tasks

Run these as separate tasks in order. Each task must begin by reading `AGENTS.md`, `architecture.md`, the listed docs, and the applicable section of `IMPLEMENTATION_SEQUENCE.md`.

## 1. Project scaffold and developer baseline

**Prompt summary:** Create the smallest Next.js and TypeScript scaffold with a neutral placeholder page and documented package scripts. Establish lint, unit-test, and production-build commands without gameplay or integrations.  
**Relevant docs:** `architecture.md`; `docs/product/MVP_SCOPE.md`; `docs/product/EPICS.md` Epic 1; `docs/technical/IMPLEMENTATION_SEQUENCE.md` Task 1.1.  
**Acceptance criteria:** Clean install works; lint, test, and production build pass; the placeholder runs; no gameplay, LLM, Supabase, persistence, deployment automation, secrets, or hardcoded production URLs are added.

## 2. Core domain model skeleton

**Prompt summary:** Add framework-independent domain type skeletons and stable identifiers for the concepts already defined in `DOMAIN_MODEL.md`. Include representative compile-time fixtures but no simulation rules.  
**Relevant docs:** `architecture.md`; `docs/technical/DOMAIN_MODEL.md`; `docs/product/EPICS.md` Epic 2; `docs/technical/IMPLEMENTATION_SEQUENCE.md` Task 2.1.  
**Acceptance criteria:** Required concepts are represented; `game-core` imports no UI, browser, network, LLM, persistence, or hosting code; type checks and existing checks pass; no formulas or gameplay balancing are introduced.

## 3. Minimal deterministic turn resolver

**Prompt summary:** Implement one pure doctrine-shift action over a minimal bounded fixture and return an immutable causal `TurnResult`. Add focused repeatability and non-mutation tests.  
**Relevant docs:** `docs/technical/DOMAIN_MODEL.md`; `docs/technical/SIMULATION_ENGINE.md`; `docs/technical/TESTING_AND_BALANCING.md`; `docs/product/EPICS.md` Epic 3; `docs/technical/IMPLEMENTATION_SEQUENCE.md` Task 3.1.  
**Acceptance criteria:** Equal inputs produce deeply equal outputs; prior state is unchanged; changed values stay bounded; tests cover valid resolution and invalid input; no rival AI, events, LLM, or UI consequence logic is added.

## 4. Minimal validated content model

**Prompt summary:** Define the smallest content schema and add one clearly provisional abstract archetype and one abstract rival capable of initializing the minimal resolver state.  
**Relevant docs:** `docs/technical/CONTENT_MODEL.md`; `docs/technical/DOMAIN_MODEL.md`; `docs/product/OPEN_QUESTIONS.md`; `docs/product/EPICS.md` Epic 4; `docs/technical/IMPLEMENTATION_SEQUENCE.md` Task 4.1.  
**Acceptance criteria:** Valid content initializes legal state; invalid content fails validation; identifiers are stable and labels provisional; no real countries, leaders, parties, or direct geopolitical mappings appear; the full content catalog is not added.

## 5. Bare playable development loop

**Prompt summary:** Add a minimal page or terminal-like development view that initializes the single archetype/rival fixture, submits the one structured action, and displays the core-produced `TurnResult`.  
**Relevant docs:** `docs/product/GAMEPLAY_LOOP.md`; `docs/technical/UI_SPEC.md`; `docs/product/EPICS.md` Epic 9; `docs/technical/IMPLEMENTATION_SEQUENCE.md` Task 9.1.  
**Acceptance criteria:** The thin slice runs locally through UI → structured action → core → `TurnResult` → UI; the UI does not calculate consequences; no multi-turn session, visual polish, free text, persistence, LLM, or Supabase is added; all checks pass.

