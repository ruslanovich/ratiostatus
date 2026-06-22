# Content Model

Content supplies validated data and explanatory language to the deterministic rules. It does not execute logic or directly mutate session state.

## Planned content categories

- **Archetypes:** starting ideology, institutions, faction configuration, strengths, tensions, and presentation.
- **Factions:** interests, dispositions, triggers, relationships, and explanatory text.
- **Institutions:** available institutional forms, requirements, affinities, and rule references.
- **Event templates:** state eligibility, crisis or opportunity framing, action options, and causal text hooks.
- **Contradiction templates:** conditions, pressure dimensions, escalation stages, and presentation.
- **Rival profiles:** starting archetype, strategic tendencies, action priorities, and display identity.
- **Ending templates:** terminal-condition references and summary text.
- **UI explanatory text:** labels, tooltips, causal phrases, and onboarding copy that do not contain game rules.

## Content principles

- Content must be abstract and archetypal, not copied from or named after real countries, leaders, parties, or current geopolitical entities.
- Stable machine identifiers must be separate from provisional display names.
- Once schemas exist, all content must validate against them in automated checks.
- Rule coefficients belong in an explicitly governed rules/configuration model, not hidden in prose.
- Templates may describe calculated results but cannot calculate them.
- Localization and final naming are future concerns; placeholder identity terms must remain visibly provisional.

## Implemented Task 4.1 fixture

`src/content/minimal/` contains exactly one provisional playable archetype and one provisional rival profile. The archetype supplies one initial ideology axis, institution, faction, and bounded project metrics. The rival supplies a separate abstract project configuration and an identifier for a deliberately unimplemented future decision policy. Both reuse the existing domain contracts and initialize a 10-turn `GameState` through `createMinimalInitialGameState()`.

The fixture is configuration only. It imports type contracts from `game-core`, while `game-core` does not import content. It contains no consequences, decision logic, events, contradictions, endings, or presentation identity. The rival currently references the sole available archetype as its origin because Task 4.1 adds exactly one archetype; mechanically distinct rival archetypes remain deferred.

`assertValidMinimalContent()` is a small local assertion layer for this fixture, not the general Task 2.2 domain validator. It checks:

- expected stable-ID namespaces and non-empty identifiers;
- player and rival roles;
- non-empty ideology axes, institutions, factions, and archetype initial references;
- ideology positions within `-100..100`;
- percentage metrics and institution strengths within `0..100`;
- archetype and faction references against available institutions and factions;
- the rival origin against the one available archetype.

The initializer validates before constructing state. Full schemas, catalog versioning, reusable state-boundary validation, additional archetypes and rivals, authoring tools, and content validation commands remain deferred to their assigned tasks. The current identifiers and all identity terms other than **Ratio Status** are provisional.
