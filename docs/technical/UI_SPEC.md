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

## Implemented development loop

`src/ui/dev-loop/` contains a deliberately bare client view for exercising the current vertical slice. On initial load it creates the validated provisional state with `createMinimalInitialGameState()` and displays the turn, player project, first ideology axis and position, and first rival project.

Task 5.2 adds the pure `createManualActionOptions(state)` UI contract. It returns labels, descriptions, structured `PlayerAction` values, enabled state, and optional disabled reasons. The fixed development set contains magnitude-10 increase and decrease doctrine shifts for the first player ideology axis, plus disabled `build_institution` and `seek_detente` placeholders. Every generated action passes structural player-action validation. If the ideology axis is missing, both shift options remain visible but disabled with a clear reason and structurally valid placeholder axis identifier.

Clicking an enabled option passes its action to `resolveTurn`. A UI-level resolver gate returns without calling the core for disabled options, and native disabled buttons enforce the same interaction constraint. After one successful resolution, all triggers remain disabled. The UI stores the returned state and `TurnResult`; it does not calculate changes. The debug result panel renders the result identifier, accepted action kind, changed field, before/after values, and causal action identifier supplied by the core.

This is a one-shot boundary demonstration. Resolver support is the only availability distinction represented: doctrine shifts are supported when an axis exists, while non-shift consequences remain unavailable. It does not implement gameplay legality rules, a session controller, repeated turn flow, a full action catalog, archetype selection, rival decisions, events, contradictions, endings, persistence, free text, or final Situation Room presentation.
