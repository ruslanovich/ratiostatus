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

