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

Task 2.2 adds focused runtime-boundary tests for finite percentage and signed-percentage bounds, integer turn ranges, stable-ID namespaces, state turn invariants, project roles and ideology requirements, action kinds and actor matching, and bounded turn-result changes. Existing content and deterministic doctrine-shift suites exercise the same validators through initial-state construction and resolver input/output validation. These are invariant tests, not balancing formula tests.

## Future simulation harness

The repository should eventually support headless full-game simulation. It should record ending distribution, dominant strategies, dead actions, unreachable content, metric saturation, contradiction trajectories, and turn-level invariant violations. Balancing should use many automated games in addition to human playtests.

Illustrative future commands:

```sh
npm test
npm run simulate -- --games 100
```

These commands are targets, not current repository capabilities. Do not add scripts or dependencies until an implementation task establishes the toolchain and simulation interface.
