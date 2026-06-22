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

This boundary is enforced by `npm run check:boundaries`, which scans TypeScript and TSX files under `src/game-core/` for forbidden source-layer imports, framework and provider packages, network modules, and direct browser globals. `npm run check` includes this check in the complete local verification sequence.

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
    minimal/
    archetypes/
    events/
    factions/
    endings/
  ui/
    dev-loop/
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

## Current implementation

- `src/app/` mounts the Task 9.1 bare development loop as the application page.
- `src/ui/dev-loop/` contains the one-shot client view and pure structured-action constructor. It initializes content through the content boundary, calls the public ordered turn resolver, and renders only core-returned consequences.
- `src/game-core/domain/` contains framework-independent TypeScript domain declarations, the nine-kind discriminated player/rival action catalog, and runtime boundary validators for numeric bounds, stable IDs, projects, state, per-kind action parameters, and turn results. It has no content, UI, or infrastructure dependencies.
- `src/game-core/simulation/` contains the pure doctrine-shift rule and the public ordered `resolveTurn` pipeline. The fixed phase tuple makes validation, player action, metrics, factions, contradictions, external relations, rivals, events, output validation, ending checks, and result assembly explicit; only input/output validation and doctrine shift currently perform work. Doctrine shift selects an ideology axis by stable ID and applies a bounded increase or decrease; other action consequences remain unsupported.
- `src/content/minimal/` contains the Task 4.1 provisional archetype and rival configuration, content-specific validation, and the initializer for one core-validated resolver-ready `GameState`. Content imports core contracts and validators; `game-core` does not import content.
- `scripts/check-import-boundaries.mjs` enforces the inward dependency rule for all TypeScript and TSX files under `src/game-core/` as part of the baseline checks.

All other folders in the planned layout remain deferred until their scoped tasks. The catalog-oriented `content` subfolders shown above remain planned; only `content/minimal` currently exists. The other planned `ui` folders also remain deferred; Task 9.1 adds only `ui/dev-loop`.
