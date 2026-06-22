# Harness Maintenance

The harness is not static. It must evolve with the product.

`AGENTS.md`, `architecture.md`, and `docs/` form the operating source of truth for future Codex work. A development task must update the harness in the same change when:

- a new subsystem is added;
- a product decision is resolved;
- a technical decision is made;
- implementation diverges from previous documentation;
- a new epic or specification is created;
- an existing assumption is invalidated;
- a new dependency is introduced;
- deployment, persistence, LLM boundaries, or the content model changes.

## Maintenance rules

- Read the operating guide, architecture, and relevant specs before editing.
- Do not let docs become stale or describe planned behavior as implemented behavior.
- Prefer small, explicit updates close to the affected decision over broad rewrites.
- Keep `architecture.md` synchronized with actual boundaries and dependency direction.
- Add a focused product or technical spec when no existing document owns a new concept.
- Append meaningful updates to `docs/codex/CHANGELOG.md`; avoid entries for inconsequential formatting.
- If uncertain, add an open question instead of silently choosing.
- Mark superseded decisions and update inbound links instead of leaving contradictory sources of truth.
- In the final task summary, state which harness docs were reviewed and changed.

