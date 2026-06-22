# Simulation Engine Specification

The simulation engine will be a pure, deterministic turn resolver. Given a valid prior `GameState`, validated content, and structured actions, it returns a new state and `TurnResult` without reading external mutable state.

## Intended turn sequence

1. Validate and apply the player action.
2. Update the player's ideology profile.
3. Update institutions and their effects.
4. Update faction influence, alignment, conflict, and response.
5. Update contradictions and their pressure.
6. Update external relations and ideological influence.
7. Select and resolve deterministic AI actions for rival projects.
8. Generate eligible state-driven events.
9. Recalculate bounded metrics and validate the resulting state.
10. Check ending conditions and construct the turn result.

The exact order is a future rules decision. Once implemented, it must be explicit and covered by tests because ordering can change outcomes.

## Constraints

- The engine must not call an LLM.
- It must not call network, browser, persistence, UI, or deployment APIs.
- Actions express intent; rules calculate every consequence.
- Identical inputs must produce identical outputs. If seeded variation is introduced later, the seed is explicit state and part of reproducibility.
- Numeric values must be bounded, and invalid intermediate or final states must fail through explicit validation.
- Turn results should expose causal changes without leaking UI formatting into the core.
- Rival actions and event eligibility must be derived from state and documented rules; MVP excludes global random shocks.

