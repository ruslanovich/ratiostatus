# Ratio Status Architecture

This document is the high-level architecture source of truth. It describes the planned boundaries; it does not imply those modules currently exist. Update it when repository structure or dependencies change.

## Planned system boundaries

| Boundary | Responsibility | MVP status |
| --- | --- | --- |
| `game-core` | Deterministic domain rules, turn resolution, rival decisions, events, scoring, and endings | Required |
| `content` | Validated archetypes, factions, institutions, event templates, rivals, endings, and explanatory text | Required |
| `ui` | Player interaction, state presentation, action construction, and turn reports | Required |
| `llm` | Optional translation of free text into validated structured actions and optional result formatting | Later/optional; not required by MVP core |
| `persistence` | Save data, authentication, and user-owned state | Deferred beyond MVP |
| `deployment` | Hosting and environment configuration | Vercel is the development target; automation is deferred |

Dependencies point inward toward stable contracts. `ui`, `llm`, and future persistence adapters may call public `game-core` interfaces. `game-core` must never import from them. Content is structured input consumed through validated core-facing contracts; it does not execute rules.

## MVP architecture stance

- Build the deterministic game core first.
- Build a manual-first UI using structured actions.
- Remain LLM-ready without making an LLM a runtime dependency.
- Introduce Supabase later only if a scoped task requires persistence, authentication, or user data.
- Target Vercel for development deployments when deployment work begins.
- Expect that production may later migrate to a rented VPC; migration is not part of the MVP harness.

## Planned data flow

```text
Action selection / future LLM parser
        ↓
Structured PlayerAction
        ↓
Game core turn resolver
        ↓
TurnResult
        ↓
UI situation room / event cards / maps
```

The future LLM path must insert a validator between parsed output and the core. Only validated `PlayerAction` data enters turn resolution.

## Dependency constraints

Allowed direction:

```text
UI ───────────────┐
LLM adapter ──────┼──> validated action contracts ──> game-core
Content loader ───┘
```

Forbidden dependencies include `game-core -> UI`, `game-core -> LLM`, `game-core -> Supabase`, `game-core -> Vercel runtime`, and any core network or browser call.

## Planned folder layout

Create folders only when a scoped implementation task needs them.

```text
src/
  game-core/
    domain/
    rules/
    simulation/
    ai/
    events/
    scoring/
  content/
    archetypes/
    events/
    factions/
    endings/
  ui/
    components/
    screens/
    state/
  llm/
    schemas/
    prompts/
    adapter/
    validator/
  app/
```

Persistence and deployment adapters should live outside `game-core` if introduced. Naming for the world, turn unit, rival entities, player polity, and UI labels remains provisional pending beta feedback.

## Delivery sequence

Implementation proceeds through small vertical slices while preserving the dependency boundaries above:

```text
developer scaffold
  → domain contracts and validation
  → one deterministic action and turn result
  → minimal validated content
  → bare manual playable slice
  → complete headless rules and session
  → content-backed systems and rivals
  → Situation Room UI
  → balancing and development deployment
```

The early bare playable slice is a boundary test, not a shortcut around the core: the UI submits a structured action and renders the returned result. Rule depth expands headlessly before visual polish. See `docs/product/EPICS.md`, `docs/product/MILESTONES.md`, and `docs/technical/IMPLEMENTATION_SEQUENCE.md` for the maintained plan.

The optional LLM adapter has no implementation slot until the structured manual loop is validated and explicitly promoted. Supabase persistence has no MVP implementation slot.
