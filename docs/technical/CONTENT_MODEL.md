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

## Implemented minimal archetype catalog

`src/content/minimal/` contains a readonly catalog of five provisional playable archetypes and one unchanged provisional rival profile. Every archetype entry supplies a stable project ID, stable archetype ID, initial ideology profile and doctrine commitments, at least one local institution, at least one local faction, complete bounded project and faction metrics, and explicit initial references. The catalog currently contains the provisional civic compact, directive synthesis, adaptive forum, continuity order, and productive compact starts.

The catalog is configuration only. It imports type contracts and validators from `game-core`, while `game-core` does not import content. It contains no consequences, decision logic, events, contradictions, endings, or selection UI. All names remain provisional, abstract, and non-real-world; they do not establish final product identity or direct geopolitical mappings.

`assertValidMinimalArchetype()` validates one archetype entry. `assertValidMinimalArchetypeCatalog()` requires at least five entries and unique archetype and project IDs. `assertValidMinimalContent()` validates a selected archetype paired with the provisional rival. These content assertions delegate generic stable-ID and numeric-bound checks to core validators and retain reference checks that do not belong to the generic domain boundary. They check:

- expected stable-ID namespaces and non-empty identifiers;
- player and rival roles;
- non-empty ideology axes, institutions, factions, and archetype initial references;
- ideology positions within `-100..100`;
- percentage metrics and institution strengths within `0..100`;
- archetype and faction references against available institutions and factions;
- unique archetype and project IDs across the starting catalog.

`minimalArchetypes` exposes the readonly catalog, and `getMinimalArchetypeById()` performs stable-ID lookup. `createMinimalInitialGameStateForArchetype()` rejects unknown IDs, initializes the selected player entry with the existing provisional rival, and validates the resulting state through `assertValidGameState()`. `createMinimalInitialGameState()` remains argument-compatible and defaults deterministically to the original provisional archetype. Catalog versioning, additional rival setups, authoring tools, and a separate content validation command remain deferred. The current identifiers and all identity terms other than **Ratio Status** are provisional.
