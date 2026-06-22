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
    intensity: 10,
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
