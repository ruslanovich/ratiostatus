# Testing and Balancing

## Testing philosophy

- Every implemented `game-core` rule requires unit tests.
- Identical initial state and action sequences must produce identical turn results.
- All numeric state values must remain within declared bounds.
- A completed turn must not produce invalid references, illegal combinations, non-finite numbers, or other invalid state.
- Content must pass schema validation once schemas exist.
- Integration tests should cover the ordered turn pipeline and causal `TurnResult` output.
- Regression fixtures should preserve important emergent interactions without tying tests to UI text.

## Implemented validation coverage

Focused runtime-boundary tests cover finite percentage and signed-percentage bounds, integer turn ranges, stable-ID namespaces, state turn invariants, project roles and ideology requirements, action kinds and actor matching, and bounded turn-result changes. The action-contract suite also covers valid examples for all nine discriminated action variants, per-kind ID namespaces and enums, required doctrine-shift magnitude bounds, and malformed parameter rejection. Existing content and doctrine-shift suites exercise the same validators through initial-state construction and resolver input/output validation. These are invariant tests, not balancing formula tests.

Doctrine-shift rule tests cover axis-ID selection, increase and decrease, clamping at both signed bounds, unknown-axis rejection, determinism, input non-mutation, and causal output. The ordered-pipeline suite confirms that structurally valid non-shift actions remain unsupported for consequence resolution.

## Implemented ordered-pipeline coverage

Task 3.2 tests the exact public `TURN_PHASES` order, equivalence between the turn entrypoint and the existing doctrine-shift resolver, equal-output determinism, input non-mutation, preservation through no-op phases, narrow rejection of unsupported actions, and output acceptance by the state and result validators. Later phase implementations must replace the relevant no-op while retaining order, causality, determinism, bounds, and non-mutation coverage.

## Future simulation harness

The repository should eventually support headless full-game simulation. It should record ending distribution, dominant strategies, dead actions, unreachable content, metric saturation, contradiction trajectories, and turn-level invariant violations. Balancing should use many automated games in addition to human playtests.

Illustrative future commands:

```sh
npm test
npm run simulate -- --games 100
```

These commands are targets, not current repository capabilities. Do not add scripts or dependencies until an implementation task establishes the toolchain and simulation interface.
