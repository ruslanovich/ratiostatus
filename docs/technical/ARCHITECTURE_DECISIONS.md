# Architecture Decisions

These ADR-style records capture accepted constraints. Amend or supersede a record explicitly when implementation changes the decision.

## ADR-001: Game core must be deterministic and independent

**Status:** Accepted  
**Decision:** Identical initial state and structured action sequences must produce identical results. The core cannot depend on UI, LLMs, persistence, hosting runtimes, browsers, external APIs, or networks.  
**Reason:** Reproducibility supports testing, balancing, debugging, and future adapter changes.

## ADR-002: Manual-first, LLM-ready UX

**Status:** Accepted  
**Decision:** Every core action must be expressible through structured controls. A future LLM may translate free text into the same validated action schema, but is never required to play.  
**Reason:** Product validation and simulation correctness must not depend on model cost, availability, or nondeterminism.

## ADR-003: Fully abstract world for MVP

**Status:** Accepted  
**Decision:** The MVP uses invented projects, geography, institutions, factions, and conflicts. It has no Earth map or direct real-world geopolitical mapping.  
**Reason:** Abstraction centers systemic ideology design and avoids reducing play to recognition of current politics.

## ADR-004: Supabase is approved but deferred

**Status:** Accepted  
**Decision:** Supabase may later support explicitly scoped persistence, authentication, or user data. It is not introduced in the MVP core or this harness.  
**Reason:** The first playable session does not require server-owned state.

## ADR-005: Vercel is the development deployment target

**Status:** Accepted  
**Decision:** When deployment work is authorized, Vercel is the initial development target. A future production move to a rented VPC is expected but deferred.  
**Reason:** This keeps early delivery simple without coupling the core to a hosting runtime.

## ADR-006: No real-world countries or political entities in content

**Status:** Accepted  
**Decision:** Content must not use real countries, leaders, parties, or direct modern geopolitical analogues.  
**Reason:** Content should remain archetypal and support the abstract world decision.

## ADR-007: Harness docs evolve with implementation

**Status:** Accepted  
**Decision:** Every change that affects architecture, domain concepts, game rules, content schemas, UI behavior, LLM contracts, or product scope must update the relevant harness docs and changelog in the same task.  
**Reason:** Future Codex work needs a current, explicit source of truth rather than inferred architecture.

