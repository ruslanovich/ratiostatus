# Ratio Status Codex Operating Guide

## Project summary

Ratio Status is a single-player ideological strategy game set in a fully abstract world. The player shapes doctrine, institutions, factions, crisis interpretation, and legitimacy; deterministic rules produce the society's internal and external history. The MVP is a compact 10–12 turn session built around structured actions, with no dependency on an LLM or persistence service.

## Non-negotiable architecture rules

- Implement only the assigned task. Do not add adjacent features without explicit scope.
- Keep `game-core` deterministic. Given the same initial state and structured actions, it must produce the same results.
- `game-core` must not depend on UI, LLMs, Supabase, Vercel, browser APIs, external APIs, network calls, or runtime infrastructure.
- An optional LLM layer may translate player language into structured actions or format structured results. It must not calculate consequences, decide game rules, or mutate game state.
- Supabase is approved infrastructure, but must not be introduced unless a task explicitly requires it.
- Never commit secrets. Use documented environment variables if integrations are introduced later.
- Do not hardcode production URLs.
- Game content must not use real countries, leaders, political parties, or direct real-world geopolitical mappings.
- When game state is implemented, every numeric value must have an explicit bound and be validated at system boundaries.
- Every game-logic change must add or update tests.
- Once content schemas exist, every content change must preserve schema validity and pass the relevant validation.
- Keep naming beyond “Ratio Status” provisional until beta feedback resolves the product identity conventions.

## Harness maintenance

The repository harness is a living source of truth. For every development task, Codex must:

1. Read `AGENTS.md`, `architecture.md`, and the relevant product and technical docs before editing.
2. Update documentation when implementation changes architecture, domain concepts, game rules, content shape, UI behavior, or LLM contracts.
3. Add a focused spec under `docs/technical/` or `docs/product/` when a task introduces a subsystem not covered by existing docs.
4. Append meaningful changes to `docs/codex/CHANGELOG.md`.
5. Keep `architecture.md` aligned with the actual repository.
6. Avoid silent architectural drift: document deliberate divergence in the same change that introduces it.
7. Record unresolved product decisions in `docs/product/OPEN_QUESTIONS.md`; record unresolved technical details in the relevant technical document.

See `docs/codex/HARNESS_MAINTENANCE.md` for the full maintenance policy.

## Standard task workflow

1. Understand the assigned task and its exclusions.
2. Read the relevant harness docs.
3. Identify affected code, content, tests, and docs.
4. Make the smallest coherent change that completes the task.
5. Add or update tests whenever code changes.
6. Update harness docs when assumptions, behavior, or architecture change.
7. Run all available checks relevant to the change.
8. Summarize files changed, checks run, documentation updated, assumptions, and known limitations.

## Source-of-truth map

- `architecture.md`: current high-level system boundaries and dependency direction.
- `docs/product/`: product intent, MVP scope, gameplay loop, and unresolved decisions.
- `docs/technical/`: technical decisions and future-facing subsystem contracts.
- `docs/codex/`: task workflow, definition of done, maintenance policy, and change history.

