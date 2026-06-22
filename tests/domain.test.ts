import { describe, expect, it } from "vitest";

import type {
  Archetype,
  GameState,
  PlayerAction,
  TurnResult,
} from "../src/game-core/domain";

const archetype = {
  id: "archetype:provisional-origin",
  initialIdeology: {
    axes: [{ id: "ideology-axis:coordination", position: 10 }],
    doctrineCommitments: ["doctrine:adaptive-mandate"],
  },
  initialInstitutionIds: ["institution:deliberative-forum"],
  initialFactionIds: ["faction:civic-coalition"],
  constraintReferences: [],
} satisfies Archetype;

const playerAction = {
  id: "action:turn-one-player",
  actorProjectId: "project:player",
  actorRole: "player",
  kind: "shift_doctrine",
  targets: [{ kind: "project", id: "project:player" }],
  intensity: 10,
} satisfies PlayerAction;

const playerProject = {
  id: "project:player",
  role: "player",
  originArchetypeId: archetype.id,
  ideology: archetype.initialIdeology,
  institutions: [
    {
      id: archetype.initialInstitutionIds[0],
      category: "governance",
      strength: 50,
      ruleReferences: [],
    },
  ],
  factions: [
    {
      id: archetype.initialFactionIds[0],
      interests: ["interest:continuity"],
      metrics: {
        power: 50,
        support: 50,
        loyalty: 50,
        visibility: 50,
        radicalization: 0,
      },
      institutionIds: archetype.initialInstitutionIds,
    },
  ],
  contradictions: [],
  relations: [],
  metrics: {
    legitimacy: 50,
    productivity: 50,
    innovation: 50,
    mobilization: 50,
  },
} as const;

const gameState = {
  id: "game:compile-time-fixture",
  turn: 0,
  turnLimit: 10,
  playerProject,
  rivalProjects: [],
  activeEventIds: [],
  history: [],
  ending: null,
} satisfies GameState;

const turnResult = {
  id: "turn-result:first",
  turn: 1,
  acceptedPlayerAction: playerAction,
  aiActions: [],
  changes: [
    {
      target: { kind: "project", id: playerProject.id },
      field: "state-field:ideology-axis-position",
      before: 10,
      after: 20,
      causes: [{ kind: "action", id: playerAction.id }],
    },
  ],
  events: [],
  ending: null,
} satisfies TurnResult;

describe("domain skeleton", () => {
  it("exposes an importable domain barrel", async () => {
    const domain = await import("../src/game-core/domain");

    expect(domain).toBeDefined();
  });

  it("supports representative compile-time fixtures", () => {
    expect(gameState.id).toBe("game:compile-time-fixture");
    expect(playerAction.kind).toBe("shift_doctrine");
    expect(turnResult.turn).toBe(1);
  });
});
