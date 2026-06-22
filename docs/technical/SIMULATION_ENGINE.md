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

## Implemented Task 3.1 slice

`src/game-core/simulation/resolveDoctrineShift.ts` implements the first narrow simulation boundary. `resolveDoctrineShift` accepts a `GameState` and a player `shift_doctrine` action, then moves the first ideology axis on the player project toward `100`. It uses the action's `Percentage` intensity or a fixed default of `10`, clamps the result to `100`, increments the turn, appends a deterministic `TurnResultId` to history, and returns one causal `StateChange` with the action as its cause.

The deterministic result identifier is derived from the game id, resulting turn number, and action id and normalized to the stable-ID kebab-case payload format. The resolver creates new state, project, ideology, axes, and history objects while preserving unrelated fields. It rejects other action kinds, non-player actor roles, actor-project mismatches, and player projects without an ideology axis.

The current `PlayerAction.intensity` contract is an unsigned `Percentage` (`0..100`), so this slice supports movement only toward the positive bound. Negative doctrine movement and axis selection require the later per-action schema work; no lower-bound movement is introduced here. The resolver now asserts the input `GameState` and `PlayerAction` before calculation and the returned `GameState` and `TurnResult` before returning. This function is not a general resolver or full turn pipeline and does not update rivals, events, factions, institutions, contradictions, relations, metrics, or endings.

## Constraints

- The engine must not call an LLM.
- It must not call network, browser, persistence, UI, or deployment APIs.
- Actions express intent; rules calculate every consequence.
- Identical inputs must produce identical outputs. If seeded variation is introduced later, the seed is explicit state and part of reproducibility.
- Numeric values must be bounded, and invalid intermediate or final states must fail through explicit validation.
- Turn results should expose causal changes without leaking UI formatting into the core.
- Rival actions and event eligibility must be derived from state and documented rules; MVP excludes global random shocks.
