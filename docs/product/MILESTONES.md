# MVP Milestones

Milestones are outcome gates, not fixed dates. An epic may contribute slices to more than one milestone; exit criteria determine completion.

## Milestone 0 — Harness Ready

**Status:** Completed.  
**Purpose:** Establish product direction, technical boundaries, and Codex operating discipline.  
**Included epics:** Epic 0.  
**Exit criteria:** Harness sources agree on MVP scope and dependency rules and have an active maintenance policy.  
**Do not include:** Application code, gameplay, integrations, or deployment automation.

## Milestone 1 — Developer Baseline

**Purpose:** Create a minimal app/development setup that builds, tests, and deploys cleanly to a Vercel preview.  
**Included epics:** Epic 1, early Epic 11 test baseline, and the compatibility slice of Epic 13.  
**Exit criteria:** Clean install; documented lint, test, and production-build commands pass; placeholder UI runs; a minimal Vercel preview can be verified without deployment automation or platform coupling in `game-core`.  
**Do not include:** Simulation, game content, LLMs, Supabase, persistence, or production hardening.

## Milestone 2 — Headless Playable Core

**Purpose:** Prove a deterministic non-visual or minimally visual 10-turn loop.  
**Included epics:** Epics 2–3, minimal slices of Epics 4–5 and 9, and core tests from Epic 11.  
**Exit criteria:** A scripted 10-turn session uses structured actions, never mutates prior state, stays valid and bounded, and reproduces equal results from equal inputs.  
**Do not include:** Rich content, complete action catalog, visual maps, advanced rivals, LLMs, or persistence.

## Milestone 3 — Content-Backed Playable Prototype

**Purpose:** Produce a coherent manual prototype with meaningful starts, choices, events, and endings.  
**Included epics:** Epics 4–5, initial Epic 8 content, and Epic 9.  
**Exit criteria:** A player selects from validated archetypes, uses the structured action catalog, sees state-driven events and turn reports, completes 10–12 turns, reaches a valid ending, and restarts in memory.  
**Do not include:** Final balance, rich faction/rival depth, polished maps, save/load, free-text input, or real-world content.

## Milestone 4 — Internal Politics and Rival Dynamics

**Purpose:** Make internal plurality, contradictions, and external competition shape each session.  
**Included epics:** Epics 6–8 and the full rival/session integration of Epic 9.  
**Exit criteria:** Factions react and create internal pressure; three rivals act and drift ideologically; contradictions and external relations generate explainable events and war risk; scripted sessions remain deterministic.  
**Do not include:** Tactical war, full parliament simulation, global random shocks, or model-driven AI.

## Milestone 5 — Visual MVP

**Purpose:** Present the complete loop through a readable Situation Room rather than text-wall gameplay.  
**Included epics:** Epic 10 plus UI-facing completion work from Epics 5, 8, and 9.  
**Exit criteria:** All specified MVP views exist; structured actions are playable; major changes, risks, and causes are identifiable within 10–20 seconds; drill-down preserves secondary detail.  
**Do not include:** Mobile-specific design, final branding, heavy animation, LLM-only controls, or production analytics.

## Milestone 6 — Balance and Playtest Build

**Purpose:** Produce a Vercel-hosted MVP candidate suitable for a private beta.  
**Included epics:** Epic 11, Epic 13, and Epic 15; stabilization across Epics 2–10.  
**Exit criteria:** Automated checks pass; headless simulations expose balance indicators; a verified Vercel preview is available; onboarding and playtest checklist are complete; no blocking known defects remain.  
**Do not include:** Supabase, accounts, save/replay, production hardening, broad analytics, or unrelated feature work.

## Milestone 7 — Optional LLM Layer

**Purpose:** Add free-text action parsing only if manual-core validation justifies it.  
**Included epics:** Epic 12.  
**Exit criteria:** Explicit promotion decision exists; output is compact, schema-valid, confidence-gated, and manually recoverable; disabling the adapter leaves gameplay complete.  
**Do not include:** Consequence calculation, state mutation, game-master behavior, core imports from the adapter, or mandatory connectivity.

Epic 14, Supabase Persistence, is not assigned to an MVP milestone and remains deferred.
