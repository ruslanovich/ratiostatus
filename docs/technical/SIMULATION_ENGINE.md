# Simulation Engine Specification

The simulation engine will be a pure, deterministic turn resolver. Given a valid prior `GameState`, validated content, and structured actions, it returns a new state and `TurnResult` without reading external mutable state.

## Implemented ordered turn sequence

`src/game-core/simulation/phases.ts` defines the authoritative phase order:

1. `validate_input`
2. `apply_player_action`
3. `update_project_metrics`
4. `update_factions`
5. `update_contradictions`
6. `update_external_relations`
7. `select_rival_actions`
8. `generate_events`
9. `validate_output`
10. `check_ending`
11. `build_turn_result`

`resolveTurn` executes a typed handler for every phase in this order. Input validation asserts the `GameState` and player action. The action phase currently delegates only `shift_doctrine` to `resolveDoctrineShift`. Output validation asserts the resulting state and turn result. Project metrics, factions, contradictions, external relations, rival actions, events, ending checks, and final result assembly are explicit context-preserving no-ops. The doctrine-shift delegate currently constructs the thin-slice result, so `build_turn_result` remains a no-op until later action composition requires shared assembly.

The order is part of the public simulation contract through `TURN_PHASES` and is covered by tests. Future rules must fill the named phase adapters without bypassing or dynamically reordering this pipeline.

## Implemented doctrine-shift slice

`src/game-core/simulation/resolveDoctrineShift.ts` implements the narrow doctrine-shift simulation boundary. `resolveDoctrineShift` accepts a `GameState` and a player `shift_doctrine` action, finds the player project's ideology axis named by `parameters.axisId`, and applies the required `parameters.magnitude`. `increase` adds the magnitude and `decrease` subtracts it; the resulting position is clamped to `-100..100`. The resolver increments the turn, appends a deterministic `TurnResultId` to history, and returns one causal `StateChange` with the action as its cause.

The deterministic result identifier is derived from the game id, resulting turn number, and action id and normalized to the stable-ID kebab-case payload format. The resolver creates new state, project, ideology, axes, and history objects while preserving unrelated fields. It rejects other action kinds, non-player actor roles, actor-project mismatches, and player projects without an ideology axis.

The resolver rejects unknown axis IDs after structural validation. It immutably maps the selected axis while preserving the other axes and asserts the returned `GameState` and `TurnResult` before returning.

The public `resolveTurn` entrypoint routes this behavior through the ordered pipeline and rejects all other action kinds. Direct `resolveDoctrineShift` remains available as the narrow rule resolver and retains its validation. Neither entrypoint updates rivals, events, factions, institutions, contradictions, relations, metrics, or endings.

## Constraints

- The engine must not call an LLM.
- It must not call network, browser, persistence, UI, or deployment APIs.
- Actions express intent; rules calculate every consequence.
- Identical inputs must produce identical outputs. If seeded variation is introduced later, the seed is explicit state and part of reproducibility.
- Numeric values must be bounded, and invalid intermediate or final states must fail through explicit validation.
- Turn results should expose causal changes without leaking UI formatting into the core.
- Rival actions and event eligibility must be derived from state and documented rules; MVP excludes global random shocks.
