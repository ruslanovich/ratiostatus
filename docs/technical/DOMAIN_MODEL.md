# Planned Domain Model

This is a conceptual vocabulary, not a final TypeScript schema. Names and boundaries may change through implementation decisions; numeric fields must eventually declare bounds and validation.

| Concept | Planned responsibility |
| --- | --- |
| `GameState` | Complete deterministic state at a turn boundary, including projects, metrics, active pressures, history references, and turn count. |
| `CivilizationalProject` | A society-level actor defined by ideology, institutions, factions, capabilities, legitimacy, contradictions, and relations. |
| `Archetype` | Validated starting configuration and thematic constraints for a project; a starting point, not a permanent class. |
| `IdeologyProfile` | Current ideological position and associated doctrine commitments. |
| `IdeologyAxis` | A bounded dimension used to represent ideological tendencies without direct real-world labels. |
| `Institution` | A durable mechanism that channels behavior, power, conflict, and the effects of doctrine. |
| `Faction` | An internal actor with interests, influence, alignment, grievances, and institutional relationships. |
| `Contradiction` | A tracked tension produced by incompatible commitments, incentives, institutions, or material pressures. |
| `ExternalRelation` | Directional relationship state between projects, including trust, hostility, influence, and pressure as later specified. |
| `RivalProject` | The AI-controlled role of a civilizational project, including a deterministic decision policy. |
| `PlayerAction` | Validated structured player intent and parameters. It never specifies its own consequences. |
| `AIAction` | Structured action selected by deterministic rival rules and processed through core rules. |
| `EventCard` | A state-derived crisis, opportunity, or interpretation prompt with references to its causes and allowed responses. |
| `TurnResult` | Immutable report of accepted actions, state changes, causal explanations, events, and ending status for one turn. |
| `Ending` | Terminal classification and explanation derived from deterministic conditions in state. |

## Model principles

- Separate configuration/content definitions from mutable session state.
- Use stable identifiers rather than display labels for rule evaluation.
- Validate all external input before core resolution.
- Keep causal evidence in turn results so the UI can explain changes.
- Treat archetype evolution as continuous state change; do not lock a project to its starting identity.
- Use provisional naming until product identity conventions are resolved.

## Implemented Task 2.1 skeleton

The public compile-time domain surface is exported from `src/game-core/domain/index.ts`. It is split into small declaration modules for primitives, ideology, institutions, factions, relations, actions, events, state, and results. These modules contain readonly data shapes and type-only imports; they do not contain rules, content entries, framework dependencies, or runtime behavior.

Stable identifiers use namespaced template-literal types such as `project:${string}` and `action:${string}`. This provides compile-time namespace distinction without claiming runtime validity. Format and referential-integrity validation remain Task 2.2 work.

Numeric aliases document these intended bounds:

- `Percentage`: inclusive `0..100` for project, faction, institution, relation, event, contradiction, and action-intensity values.
- `SignedPercentage`: inclusive `-100..100` for ideology-axis positions and the general numeric change envelope.
- `TurnNumber`: integer `0..12`, where zero can represent the initial turn boundary.
- `TurnLimit`: integer `10..12` for the configured MVP session length.

The initial core metric names are legitimacy, productivity, innovation, and mobilization. Faction metric names follow the existing Epic 6 vocabulary: power, support, loyalty, visibility, and radicalization. External relations are directional and expose trust, hostility, influence, and pressure. These names establish shared vocabulary only; they do not define formulas, coefficients, invariants, or consequences.

`PlayerAction` and `AIAction` share the nine action kinds already named by the gameplay loop, while their actor roles form a discriminated union. Actions carry intent, domain targets, and optional bounded intensity, never results. Detailed per-action parameter schemas remain Task 5.1 work.

`TurnResult` represents the accepted player action, rival actions, structured numeric changes with causal references, emitted event cards, and an optional ending. It does not resolve a turn or include presentation formatting. Ending definitions, event definitions, content catalogs, and all runtime validators remain deferred to their assigned tasks.
