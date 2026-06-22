# Product Requirements Document

## Product vision and core fantasy

Ratio Status is a single-player ideological strategy game about designing a system of ideas and watching it produce history semi-autonomously. The player governs the upper meta-layer of a society—doctrine, institutions, factions, crisis interpretation, internal conflict channels, and legitimacy—rather than directly managing armies, buildings, taxes, or production chains.

The society's productivity, innovation, mobilization, external relations, ideological influence, contradictions, crises, and endings emerge from deterministic rules. The result should feel distinct from a conventional civilization-building game.

## MVP experience

- One 45–75 minute session spanning 10–12 turns.
- One player project selected from predefined archetypes; no full ideology constructor at game start.
- Three AI rival civilizational projects that make structured decisions and evolve ideologically.
- A fully abstract world with no Earth map, real countries, leaders, parties, or direct modern geopolitical mapping.
- Civilizational styles that may suggest different “eras” and coexist; linear era progression is not the main driver.
- Structured player actions, state-driven events, deterministic consequences, and concise visual reports.
- Manual-first interaction. The game must be complete and playable without an LLM.

## Player role

The player defines how a civilizational project interprets pressure and organizes power. They can evolve far from the starting archetype. Radical turns are allowed, but must create proportional factional, institutional, legitimacy, contradiction, and external consequences.

## Game pillars

1. **Ideology has mechanical consequences.** Doctrine changes institutions, incentives, alignment, and available responses.
2. **Society has agency.** Factions, institutions, and rivals react through deterministic rules rather than waiting for direct orders.
3. **Contradictions create history.** Internal tensions and external pressure generate most crises; there are no global random shocks in MVP.
4. **Causality is legible.** Players can see what changed, why, and which risks follow.
5. **Transformation has a cost.** Compromise and radical change are viable, but neither is consequence-free.

## Major systems

- **Archetypes and ideological evolution:** predefined starting positions with meaningful room to transform.
- **Internal politics:** factions, institutions, legitimacy, and channels for conflict or compromise.
- **External rivals:** three projects with evolving ideology, relations, and autonomous behavior.
- **Autonomous state behavior:** lower-level outcomes derived from current state and structured decisions.
- **Events:** mostly state-generated crisis and opportunity cards, not arbitrary global randomness.
- **Visual interface:** a situation room supported by faction and relation maps, contradiction tracking, a timeline, and concise turn reports.
- **Optional semantic layer:** a future LLM may classify free text into structured actions or format results, but cannot own rules, calculate consequences, or mutate state.

## Victory and failure

An ending should summarize whether the player's project remained viable, achieved ideological influence or strategic goals, transformed into another stable form, collapsed under contradictions, lost legitimacy, or succumbed to external pressure. Exact ending thresholds and scoring are deferred to simulation design and balancing; endings must follow deterministic state and documented rules.

## Goals

- Validate that managing ideology and institutional consequences produces understandable strategic choices.
- Deliver a complete short-session arc with replay value from archetype, action, faction, and rival interactions.
- Establish deterministic, testable rules that later interfaces—including an optional LLM—can safely drive through structured actions.

## Non-goals

The MVP does not include a real-world map or entities, tactical warfare, detailed economic production, a full technology tree, full parliament simulation, multiplayer, save/load/replay, authentication, analytics, persistence, global random shocks, or an LLM game master. See `MVP_SCOPE.md` for the scope lock.

## Acceptance criteria

- A player can complete a 10–12 turn session in approximately 45–75 minutes.
- A predefined archetype can evolve substantially, with proportional and explainable consequences.
- Three rival projects act and evolve without player control.
- Core outcomes are deterministic for identical initial state and structured action sequence.
- Events arise mainly from game state and clearly expose their causes.
- The interface communicates turn changes, risk, and causality within 10–20 seconds.
- At least one success, transformation, and failure path can reach an ending through game rules.
- The complete core loop works with structured controls and no LLM, network, Supabase, or persistence dependency.
- All content remains abstract and avoids direct real-world political mapping.

