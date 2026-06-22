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

`resolveTurn` executes a typed handler for every phase in this order. Input validation asserts the `GameState` and player action. The action phase currently delegates only `shift_doctrine` to `resolveDoctrineShift`. `update_project_metrics` then applies the implemented placeholder derivation described below. Output validation asserts the resulting state and turn result. Factions, contradictions, external relations, rival actions, events, ending checks, and final result assembly remain explicit context-preserving no-ops. The doctrine-shift delegate currently constructs the thin-slice result, so `build_turn_result` remains a no-op until later action composition requires shared assembly.

The order is part of the public simulation contract through `TURN_PHASES` and is covered by tests. Future rules must fill the named phase adapters without bypassing or dynamically reordering this pipeline.

## Implemented doctrine-shift slice

`src/game-core/simulation/resolveDoctrineShift.ts` implements the narrow doctrine-shift simulation boundary. `resolveDoctrineShift` accepts a `GameState` and a player `shift_doctrine` action, finds the player project's ideology axis named by `parameters.axisId`, and applies the required `parameters.magnitude`. `increase` adds the magnitude and `decrease` subtracts it; the resulting position is clamped to `-100..100`. The resolver increments the turn, appends a deterministic `TurnResultId` to history, and returns one causal `StateChange` with the action as its cause.

The deterministic result identifier is derived from the game id, resulting turn number, and action id and normalized to the stable-ID kebab-case payload format. The resolver creates new state, project, ideology, axes, and history objects while preserving unrelated fields. It rejects other action kinds, non-player actor roles, actor-project mismatches, and player projects without an ideology axis.

The resolver rejects unknown axis IDs after structural validation. It immutably maps the selected axis while preserving the other axes and asserts the returned `GameState` and `TurnResult` before returning.

The public `resolveTurn` entrypoint routes this behavior through the ordered pipeline and rejects all other action kinds. Direct `resolveDoctrineShift` remains available as the narrow rule resolver and retains its validation; it does not derive metrics. Neither entrypoint updates rivals, events, factions, institutions, contradictions, relations, productivity, innovation, or endings.

## Implemented placeholder project-metric derivation

`src/game-core/simulation/updateProjectMetrics.ts` is a pure phase helper that requires the state and existing `TurnResult` produced by the action phase. It inspects `result.acceptedPlayerAction` and acts only for `shift_doctrine`. An increase adds one mobilization and subtracts one legitimacy; a decrease subtracts one mobilization and adds one legitimacy. Both results clamp to the project-metric bound `0..100`.

The helper returns new state and result objects, preserves unrelated state references, and appends mobilization and legitimacy `StateChange` entries after the doctrine-axis change. Each appended change targets the player project and cites the accepted player action as its cause. These fixed one-point deltas are intentionally minimal placeholder derivation, not a balance formula, axis-specific rule, or archetype-specific system.

## Implemented headless scripted session

`src/game-core/session/runScriptedSession.ts` provides a generic, synchronous in-memory runner. It validates the supplied initial `GameState`, validates each action against the current player project, sends every action through the public `resolveTurn` pipeline, and collects each returned `TurnResult` in order. It returns the original initial-state reference, the final resolved state, and the ordered results without mutating the initial state or action list.

The core runner has no content knowledge. `src/content/minimal/scriptedSession.ts` owns the current fixture-specific proof: ten stable, magnitude-10 `shift_doctrine` actions against the minimal player's first ideology axis. The helper starts at turn zero and completes at turn ten with ten matching history references. Only `shift_doctrine` is supported. Factions, contradictions, external relations, rival actions, events, endings, and shared result finalization remain no-op or deferred phases, and the scripted proof does not add a complete session lifecycle.

## Constraints

- The engine must not call an LLM.
- It must not call network, browser, persistence, UI, or deployment APIs.
- Actions express intent; rules calculate every consequence.
- Identical inputs must produce identical outputs. If seeded variation is introduced later, the seed is explicit state and part of reproducibility.
- Numeric values must be bounded, and invalid intermediate or final states must fail through explicit validation.
- Turn results should expose causal changes without leaking UI formatting into the core.
- Rival actions and event eligibility must be derived from state and documented rules; MVP excludes global random shocks.
