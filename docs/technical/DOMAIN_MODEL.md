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

