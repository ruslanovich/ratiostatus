import { describe, expect, it } from "vitest";

import { createMinimalInitialGameState } from "../src/content";
import {
  assertPercentage,
  assertSignedPercentage,
  assertStableId,
  assertTurnLimit,
  assertTurnNumber,
  assertValidGameState,
  assertValidPlayerAction,
  assertValidTurnResult,
  type GameState,
  type PlayerAction,
  type TurnResult,
} from "../src/game-core/domain";
import { resolveDoctrineShift } from "../src/game-core/simulation";

function createAction(state: GameState): PlayerAction {
  return {
    id: "action:validation-doctrine-shift",
    actorProjectId: state.playerProject.id,
    actorRole: "player",
    kind: "shift_doctrine",
    targets: [{ kind: "project", id: state.playerProject.id }],
    parameters: {
      axisId: state.playerProject.ideology.axes[0].id,
      direction: "increase",
      magnitude: 10,
    },
  };
}

describe("domain validation", () => {
  it("accepts the valid minimal initial GameState", () => {
    expect(() => assertValidGameState(createMinimalInitialGameState())).not.toThrow();
  });

  it.each([-1, 101, Number.NaN, Number.POSITIVE_INFINITY])(
    "rejects invalid percentage %s",
    (value) => {
      expect(() => assertPercentage(value, "percentage")).toThrow("0..100");
    },
  );

  it.each([-101, 101, Number.NaN, Number.NEGATIVE_INFINITY])(
    "rejects invalid signed percentage %s",
    (value) => {
      expect(() => assertSignedPercentage(value, "signed percentage")).toThrow(
        "-100..100",
      );
    },
  );

  it.each([-1, 13, 1.5, Number.NaN])("rejects invalid turn number %s", (value) => {
    expect(() => assertTurnNumber(value, "turn")).toThrow("0..12");
  });

  it.each([9, 13, 10.5, Number.POSITIVE_INFINITY])(
    "rejects invalid turn limit %s",
    (value) => {
      expect(() => assertTurnLimit(value, "turn limit")).toThrow("10..12");
    },
  );

  it("rejects a stable ID with the wrong namespace", () => {
    expect(() => assertStableId("event:wrong", "project", "project id")).toThrow(
      "project:lowercase-kebab-case",
    );
  });

  it("rejects a GameState whose turn exceeds its turn limit", () => {
    const state = createMinimalInitialGameState();
    const invalid = { ...state, turn: 11, turnLimit: 10 } satisfies GameState;

    expect(() => assertValidGameState(invalid)).toThrow("must not exceed");
  });

  it("rejects a player project with no ideology axes", () => {
    const state = createMinimalInitialGameState();
    const invalid = {
      ...state,
      playerProject: {
        ...state.playerProject,
        ideology: { ...state.playerProject.ideology, axes: [] },
      },
    } satisfies GameState;

    expect(() => assertValidGameState(invalid)).toThrow("at least one ideology axis");
  });

  it("rejects a rival with a non-rival role", () => {
    const state = createMinimalInitialGameState();
    const invalid = {
      ...state,
      rivalProjects: [{ ...state.rivalProjects[0], role: "player" }],
    } as unknown as GameState;

    expect(() => assertValidGameState(invalid)).toThrow("role must be rival");
  });

  it("rejects an unsupported PlayerAction kind supplied through an unsafe cast", () => {
    const state = createMinimalInitialGameState();
    const invalid = { ...createAction(state), kind: "invent_rule" } as unknown as PlayerAction;

    expect(() => assertValidPlayerAction(invalid)).toThrow("invalid value invent_rule");
  });

  it("accepts shift_doctrine with explicit parameters", () => {
    const state = createMinimalInitialGameState();

    expect(() => assertValidPlayerAction(createAction(state))).not.toThrow();
  });

  it("rejects an invalid shift_doctrine axis namespace", () => {
    const state = createMinimalInitialGameState();
    const invalid = {
      ...createAction(state),
      parameters: { ...createAction(state).parameters, axisId: "event:not-an-axis" },
    } as unknown as PlayerAction;

    expect(() => assertValidPlayerAction(invalid)).toThrow(
      "ideology-axis:lowercase-kebab-case",
    );
  });

  it("rejects an invalid shift_doctrine direction", () => {
    const state = createMinimalInitialGameState();
    const invalid = {
      ...createAction(state),
      parameters: { ...createAction(state).parameters, direction: "sideways" },
    } as unknown as PlayerAction;

    expect(() => assertValidPlayerAction(invalid)).toThrow("invalid value sideways");
  });

  it.each([-1, 101, Number.NaN, Number.POSITIVE_INFINITY])(
    "rejects invalid shift_doctrine magnitude %s",
    (magnitude) => {
      const state = createMinimalInitialGameState();
      const invalid = {
        ...createAction(state),
        parameters: { ...createAction(state).parameters, magnitude },
      } as PlayerAction;

      expect(() => assertValidPlayerAction(invalid)).toThrow("0..100");
    },
  );

  it.each<PlayerAction>([
    {
      id: "action:build-institution",
      actorProjectId: "project:player",
      actorRole: "player",
      kind: "build_institution",
      targets: [{ kind: "institution", id: "institution:public-forum" }],
      parameters: { institutionId: "institution:public-forum", category: "governance" },
    },
    {
      id: "action:reinterpret-crisis",
      actorProjectId: "project:player",
      actorRole: "player",
      kind: "reinterpret_crisis",
      targets: [{ kind: "event", id: "event:supply-strain" }],
      parameters: { eventId: "event:supply-strain", frame: "order" },
    },
    {
      id: "action:define-enemy",
      actorProjectId: "project:player",
      actorRole: "player",
      kind: "define_enemy",
      targets: [{ kind: "project", id: "project:rival" }],
      parameters: { targetProjectId: "project:rival", framing: "competitive" },
    },
    {
      id: "action:make-compromise",
      actorProjectId: "project:player",
      actorRole: "player",
      kind: "make_compromise",
      targets: [{ kind: "faction", id: "faction:builders" }],
      parameters: { factionId: "faction:builders", concession: "symbolic" },
    },
    {
      id: "action:suppress-faction",
      actorProjectId: "project:player",
      actorRole: "player",
      kind: "suppress_faction",
      targets: [{ kind: "faction", id: "faction:builders" }],
      parameters: { factionId: "faction:builders", method: "legal" },
    },
    {
      id: "action:empower-faction",
      actorProjectId: "project:player",
      actorRole: "player",
      kind: "empower_faction",
      targets: [{ kind: "faction", id: "faction:builders" }],
      parameters: { factionId: "faction:builders", channel: "resource" },
    },
    {
      id: "action:export-ideology",
      actorProjectId: "project:player",
      actorRole: "player",
      kind: "export_ideology",
      targets: [{ kind: "project", id: "project:rival" }],
      parameters: { targetProjectId: "project:rival", channel: "media" },
    },
    {
      id: "action:seek-detente",
      actorProjectId: "project:player",
      actorRole: "player",
      kind: "seek_detente",
      targets: [{ kind: "project", id: "project:rival" }],
      parameters: { targetProjectId: "project:rival", basis: "trade" },
    },
  ])("accepts explicit parameters for $kind", (action) => {
    expect(() => assertValidPlayerAction(action)).not.toThrow();
  });

  it("rejects an invalid non-shift enum parameter", () => {
    const invalid = {
      id: "action:invalid-detente",
      actorProjectId: "project:player",
      actorRole: "player",
      kind: "seek_detente",
      targets: [{ kind: "project", id: "project:rival" }],
      parameters: { targetProjectId: "project:rival", basis: "domination" },
    } as unknown as PlayerAction;

    expect(() => assertValidPlayerAction(invalid)).toThrow("invalid value domination");
  });

  it("rejects a PlayerAction actor mismatch against state", () => {
    const state = createMinimalInitialGameState();
    const invalid = {
      ...createAction(state),
      actorProjectId: "project:different-player",
    } satisfies PlayerAction;

    expect(() => assertValidPlayerAction(invalid, state)).toThrow(
      "must match the player project",
    );
  });

  it("rejects a TurnResult with an out-of-bounds change value", () => {
    const state = createMinimalInitialGameState();
    const { result } = resolveDoctrineShift(state, createAction(state));
    const invalid = {
      ...result,
      changes: [{ ...result.changes[0], after: 101 }],
    } satisfies TurnResult;

    expect(() => assertValidTurnResult(invalid)).toThrow("-100..100");
  });
});
