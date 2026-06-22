# Ratio Status

Ratio Status is a planned single-player ideological strategy game in a fully abstract world. The player shapes a civilizational project's doctrine, institutions, factions, crisis interpretation, and legitimacy while deterministic rules produce internal conflict, external pressure, and historical outcomes.

## Repository status

This repository contains a minimal Next.js and TypeScript application scaffold, framework-independent game-core domain types, one deterministic doctrine-shift resolver, one validated provisional archetype/rival fixture, and the product, architecture, and Codex operating harness. The application now exposes a bare development loop that initializes the fixture, submits the single supported structured action, and displays the core-produced turn result. This proves the UI-to-core boundary; it is not the gameplay MVP or a multi-turn session. There is no general domain validation, complete simulation, LLM integration, Supabase integration, authentication, persistence, or deployment automation.

The MVP is planned as a manual-first, 10–12 turn session with predefined archetypes, three evolving AI rival projects, structured actions, deterministic simulation, state-driven events, and ending states. The game will not use real countries, leaders, parties, geography, or direct modern geopolitical mappings.

## Development and deployment direction

- Keep the future game core deterministic and independent from presentation and infrastructure.
- Vercel is the planned development deployment target; deployment setup is not part of the current harness.
- The future public domain is `ratiostatus.org`; production URLs must not be hardcoded.
- Production may later move to a rented VPC, but that migration is outside MVP scope.
- Supabase is approved for possible future persistence, authentication, or user data needs, but is deferred until explicitly required.
- An LLM may later provide an optional structured language adapter. Core gameplay must work without one.

## Local development

Prerequisites: Node.js 20.9 or newer and npm.

Install the locked dependencies:

```sh
npm ci
```

Start the local development server:

```sh
npm run dev
```

The application is then available at the local URL printed by Next.js.

## Verification

Run each baseline check independently:

```sh
npm run lint
npm run typecheck
npm test
npm run check:boundaries
npm run build
```

The boundary check scans TypeScript and TSX files under `src/game-core/` and rejects imports from presentation, content, framework, provider, browser, and network/runtime modules. Run the complete sequence with:

```sh
npm run check
```

## Documentation

- [Architecture](architecture.md)
- [Product requirements](docs/product/PRD.md)
- [MVP scope](docs/product/MVP_SCOPE.md)
- [Gameplay loop](docs/product/GAMEPLAY_LOOP.md)
- [Open questions](docs/product/OPEN_QUESTIONS.md)
- [Technical decisions](docs/technical/ARCHITECTURE_DECISIONS.md)
- [Codex operating guide](AGENTS.md)
- [Definition of done](docs/codex/DEFINITION_OF_DONE.md)
