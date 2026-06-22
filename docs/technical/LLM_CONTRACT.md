# Future LLM Contract

An LLM is an optional semantic adapter, not a game system. Ratio Status must remain fully playable through structured controls without model access.

## Boundary

A future adapter may:

- classify player text into an allowed structured `PlayerAction` proposal;
- normalize language into known identifiers and tags;
- format structured turn results into optional presentation text.

It must not:

- calculate action consequences;
- choose or alter game rules;
- directly mutate `GameState`;
- bypass schema or domain validation;
- become required for the core gameplay loop.

## Operational requirements

- Target a small, inexpensive model appropriate for classification.
- Use compact prompts containing only the context needed for the task.
- Require strict structured output against a versioned schema.
- Validate schema, allowed identifiers, ranges, and game legality before calling the core.
- Enforce a configured confidence threshold. Below-threshold or invalid results return the player to manual structured controls.
- Keep a manual fallback available for every supported LLM operation.
- Treat model output as untrusted input.

## Example future classification input

```json
{
  "task": "classify_player_intent",
  "allowed_action_types": [
    "shift_doctrine",
    "build_institution",
    "reinterpret_crisis",
    "define_enemy",
    "make_compromise",
    "suppress_faction",
    "empower_faction",
    "export_ideology",
    "seek_detente"
  ],
  "current_archetype": "revolutionary_workers_republic",
  "current_crisis": "industrial_strikes",
  "player_text": "Фабрики должны принадлежать тем, кто на них работает, но партия сохранит стратегическое руководство."
}
```

## Example future classification output

```json
{
  "action_type": "build_institution",
  "target": "worker_councils",
  "intensity": 0.68,
  "tags": ["worker_power", "collectivism", "controlled_pluralism"],
  "confidence": 0.86
}
```

The example identifiers are provisional. The validator must reject unknown values, out-of-range intensity or confidence, and actions illegal in the current state before constructing a core action.

