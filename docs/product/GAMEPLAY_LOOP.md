# Gameplay Loop

Each turn should follow a clear cause-and-effect sequence:

1. **Inspect the situation.** Review ideology, institutions, factions, contradictions, legitimacy, external relations, and recent history.
2. **Receive a crisis or opportunity.** The simulation selects a state-relevant event rather than a global random shock.
3. **Choose or formulate an ideological action.** The player uses structured controls; a future optional language parser may propose the same structured action.
4. **Simulate consequences.** The deterministic core applies rules to ideology, institutions, factions, contradictions, relations, and metrics.
5. **Resolve rival reactions.** Three AI projects choose deterministic actions from their own state and relationship context.
6. **Read the turn report.** The UI presents the largest changes, their causes, and immediate risks.
7. **Observe evolving pressure.** Contradictions, faction alignment, legitimacy, and external threats create the next decision context.
8. **Repeat until an ending.** After 10–12 turns, or an earlier terminal condition, the game resolves an ending from state.

## Example player actions

- Shift doctrine.
- Build or reform an institution.
- Reinterpret a crisis.
- Define an enemy.
- Make a compromise.
- Suppress a faction.
- Empower a faction.
- Export ideology.
- Seek détente.

Actions describe intent and parameters; they do not contain their own consequences. The game core validates the action and determines results.

The structured contract uses the action `kind` as a discriminator. Every action carries base identity, actor, and target references plus a kind-specific `parameters` object. Doctrine shifts identify an ideology axis, direction, and bounded magnitude; the other eight actions similarly identify only their subject and compact framing, method, channel, concession, category, or basis. These payloads express player intent only. Availability and gameplay legality are separate rule concerns.

The current development loop exposes a small manual-first option set derived from the current state. Increase and decrease doctrine shifts target the player's first ideology axis and can be submitted once. Institution-building and détente appear as disabled structured placeholders with an explicit resolver-support reason. Their presence demonstrates the action-selection contract; it does not make their consequences available.
