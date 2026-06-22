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

## Implemented domain surface and Task 2.2 validation

The public domain surface is exported from `src/game-core/domain/index.ts`. It is split into small modules for primitives, ideology, institutions, factions, relations, actions, events, state, results, and validation. The data shapes remain readonly and framework-independent. The validation module contains assertions only; it does not contain rules, content entries, consequence calculations, or infrastructure dependencies.

Stable identifiers use namespaced template-literal types such as `project:${string}` and `action:${string}`. Runtime validation requires the exact `namespace:lowercase-kebab-case` form. Namespace and local format checks are implemented without a global ID registry.

Numeric aliases document these intended bounds:

- `Percentage`: inclusive `0..100` for project, faction, institution, relation, event, contradiction, and action-intensity values.
- `SignedPercentage`: inclusive `-100..100` for ideology-axis positions and the general numeric change envelope.
- `TurnNumber`: integer `0..12`, where zero can represent the initial turn boundary.
- `TurnLimit`: integer `10..12` for the configured MVP session length.

The initial core metric names are legitimacy, productivity, innovation, and mobilization. Faction metric names follow the existing Epic 6 vocabulary: power, support, loyalty, visibility, and radicalization. External relations are directional and expose trust, hostility, influence, and pressure. These names establish shared vocabulary only; they do not define formulas, coefficients, invariants, or consequences.

`PlayerAction` and `AIAction` share the nine action kinds already named by the gameplay loop, while their actor roles form a discriminated union. Actions carry intent, domain targets, and optional bounded intensity, never results. Detailed per-action parameter schemas remain Task 5.1 work.

`TurnResult` represents the accepted player action, rival actions, structured numeric changes with causal references, emitted event cards, and an optional ending. It does not resolve a turn or include presentation formatting. Ending definitions, event definitions, and content catalogs remain deferred to their assigned tasks.

Task 2.2 adds assertion helpers for percentages, signed percentages, turn numbers, turn limits, and stable IDs, plus aggregate validators for `CivilizationalProject`, `GameState`, `PlayerAction`, and `TurnResult`. Aggregate validation covers documented roles and enum values, required array shapes, project metrics, ideology axes, institution and faction data, contradictions, relations, event cards, endings, and causal references. Faction institution references are checked against institutions on the same project.

Validation establishes domain-boundary legality only. Detailed per-action parameter and target schemas remain Task 5.1 work. Global ID uniqueness, global registries, catalog-wide referential integrity, cross-project relationship membership, content versioning, and gameplay legality or balancing formulas remain deferred.
