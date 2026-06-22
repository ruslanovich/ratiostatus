# MVP UI Specification

## Core UX principle

The player should understand within 10–20 seconds what changed, where the risks are, and why.

The UI should prioritize event cards over long logs, visible causal links over unexplained metric changes, drill-down over text walls, and relationship maps or faction graphs over tables where those views clarify structure. Structured controls must support the complete game without free text.

## Intended screens and views

- **Situation Room:** turn overview, urgent crisis or opportunity, primary metrics, major risks, and action entry point.
- **Ideology Panel:** current axes, doctrine commitments, archetype origin, transformation, and tensions between positions.
- **Faction Map:** faction influence, alignment, conflicts, institutional links, and recent movement.
- **External Relations Map:** abstract project relationships, ideological influence, hostility, trust, and active pressure without a real-world map.
- **Contradiction Tracker:** active tensions, causes, trajectory, escalation risk, and linked factions or institutions.
- **Historical Timeline:** compact record of consequential actions, events, transformations, and rival moves.
- **Turn Report:** ranked changes, causal explanation, rival reactions, new events, and emerging risks.

## Interaction and explanation

- Present an action's intent and valid parameters before confirmation; never promise calculated consequences outside core-provided projections.
- Show the most consequential changes first and group secondary detail behind drill-down.
- Connect each reported change to an action, rule effect, rival response, or existing pressure when the core provides that evidence.
- Use clear placeholders for provisional world and entity names.
- Do not make an LLM interaction the only way to submit an action.

Exact layout, visual language, responsive behavior, and naming remain future design decisions. Mobile-specific UI is outside MVP.

## Implemented Task 9.1 development loop

`src/ui/dev-loop/` contains a deliberately bare client view for exercising the current vertical slice. On initial load it creates the validated provisional state with `createMinimalInitialGameState()`, displays the turn, player project, first ideology axis and position, and first rival project, and exposes exactly one manual **Resolve doctrine shift** trigger.

The trigger constructs a structured player `shift_doctrine` intent and passes the current state and action to `resolveDoctrineShift`. The UI stores the returned state and `TurnResult`; it does not calculate changes. The debug result panel renders the result identifier, accepted action kind, changed field, before/after values, and causal action identifier supplied by the core.

This is a one-shot boundary demonstration. The trigger is disabled after its first successful resolution. It does not implement a session controller, repeated turn flow, action catalog, legality UI, archetype selection, rival decisions, events, contradictions, endings, persistence, free text, or final Situation Room presentation.
