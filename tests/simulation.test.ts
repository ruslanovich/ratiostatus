import { describe, expect, it } from "vitest";

import type { AIAction, GameState, PlayerAction } from "../src/game-core/domain";
import {
  assertValidGameState,
  assertValidTurnResult,
} from "../src/game-core/domain";
import {
  resolveDoctrineShift,
  resolveTurn,
  TURN_PHASES,
} from "../src/game-core/simulation";

function createState(position = 10): GameState {
  return {
    id: "game:doctrine-shift-fixture",
    turn: 0,
    turnLimit: 10,
    playerProject: {
      id: "project:player",
      role: "player",
      originArchetypeId: "archetype:provisional-origin",
      ideology: {
        axes: [
          { id: "ideology-axis:coordination", position },
          { id: "ideology-axis:openness", position: -20 },
        ],
        doctrineCommitments: ["doctrine:adaptive-mandate"],
      },
      institutions: [],
      factions: [],
      contradictions: [],
      relations: [],
      metrics: {
        legitimacy: 50,
        productivity: 50,
        innovation: 50,
        mobilization: 50,
      },
    },
    rivalProjects: [],
    activeEventIds: [],
    history: [],
    ending: null,
  };
}

function createAction(overrides: Partial<PlayerAction> = {}): PlayerAction {
  return {
    id: "action:turn-one-player",
    actorProjectId: "project:player",
    actorRole: "player",
    kind: "shift_doctrine",
    targets: [{ kind: "project", id: "project:player" }],
    intensity: 15,
    ...overrides,
  };
}

describe("resolveDoctrineShift", () => {
  it("resolves a valid shift against the first ideology axis", () => {
    const input = createState();
    const { state, result } = resolveDoctrineShift(input, createAction());

    expect(state.playerProject.ideology.axes[0]?.position).toBe(25);
    expect(state.playerProject.ideology.axes[1]?.position).toBe(-20);
    expect(state.turn).toBe(1);
    expect(state.history).toEqual([result.id]);
    expect(result.turn).toBe(1);
  });

  it("uses the documented default intensity when intensity is absent", () => {
    const { state } = resolveDoctrineShift(
      createState(),
      createAction({ intensity: undefined }),
    );

    expect(state.playerProject.ideology.axes[0]?.position).toBe(20);
  });

  it("does not mutate the input state", () => {
    const input = createState();
    const snapshot = structuredClone(input);

    const { state } = resolveDoctrineShift(input, createAction());

    expect(input).toEqual(snapshot);
    expect(state).not.toBe(input);
    expect(state.playerProject).not.toBe(input.playerProject);
    expect(state.playerProject.ideology).not.toBe(input.playerProject.ideology);
    expect(state.playerProject.ideology.axes).not.toBe(
      input.playerProject.ideology.axes,
    );
  });

  it("returns deeply equal output for equal input", () => {
    const first = resolveDoctrineShift(createState(), createAction());
    const second = resolveDoctrineShift(createState(), createAction());

    expect(first).toEqual(second);
  });

  it("clamps the first ideology axis position to 100", () => {
    const { state, result } = resolveDoctrineShift(
      createState(95),
      createAction({ intensity: 20 }),
    );

    expect(state.playerProject.ideology.axes[0]?.position).toBe(100);
    expect(result.changes[0]?.after).toBe(100);
  });

  it("rejects a non-shift action", () => {
    expect(() =>
      resolveDoctrineShift(
        createState(),
        createAction({ kind: "build_institution" }),
      ),
    ).toThrow("only accepts shift_doctrine");
  });

  it("rejects an action with a rival actor role", () => {
    const rivalAction: AIAction = {
      ...createAction(),
      actorRole: "rival",
    };

    expect(() =>
      resolveDoctrineShift(createState(), rivalAction as unknown as PlayerAction),
    ).toThrow("player actor role");
  });

  it("rejects an action from a different project", () => {
    expect(() =>
      resolveDoctrineShift(
        createState(),
        createAction({ actorProjectId: "project:not-player" }),
      ),
    ).toThrow("must match the player project");
  });

  it("rejects a state without a player ideology axis", () => {
    const input = createState();
    const stateWithoutAxes: GameState = {
      ...input,
      playerProject: {
        ...input.playerProject,
        ideology: { ...input.playerProject.ideology, axes: [] },
      },
    };

    expect(() =>
      resolveDoctrineShift(stateWithoutAxes, createAction()),
    ).toThrow("at least one ideology axis");
  });

  it("returns one causal state change referencing the action", () => {
    const action = createAction();
    const { result } = resolveDoctrineShift(createState(), action);

    expect(result.changes).toEqual([
      {
        target: { kind: "project", id: "project:player" },
        field:
          "state-field:ideology-axis-position-coordination",
        before: 10,
        after: 25,
        causes: [{ kind: "action", id: action.id }],
      },
    ]);
  });
});

describe("ordered turn pipeline", () => {
  it("exposes the documented phase order", () => {
    expect(TURN_PHASES).toEqual([
      "validate_input",
      "apply_player_action",
      "update_project_metrics",
      "update_factions",
      "update_contradictions",
      "update_external_relations",
      "select_rival_actions",
      "generate_events",
      "validate_output",
      "check_ending",
      "build_turn_result",
    ]);
  });

  it("resolves shift_doctrine with the existing effective output", () => {
    const state = createState();
    const action = createAction();

    expect(resolveTurn(state, action)).toEqual(resolveDoctrineShift(state, action));
  });

  it("returns deeply equal output for equal input", () => {
    expect(resolveTurn(createState(), createAction())).toEqual(
      resolveTurn(createState(), createAction()),
    );
  });

  it("does not mutate input state", () => {
    const input = createState();
    const snapshot = structuredClone(input);

    resolveTurn(input, createAction());

    expect(input).toEqual(snapshot);
  });

  it("preserves state outside the implemented action phase", () => {
    const input = createState();
    const { state, result } = resolveTurn(input, createAction());

    expect(state.playerProject.metrics).toBe(input.playerProject.metrics);
    expect(state.playerProject.factions).toBe(input.playerProject.factions);
    expect(state.playerProject.contradictions).toBe(
      input.playerProject.contradictions,
    );
    expect(state.playerProject.relations).toBe(input.playerProject.relations);
    expect(state.rivalProjects).toBe(input.rivalProjects);
    expect(state.activeEventIds).toBe(input.activeEventIds);
    expect(result.aiActions).toEqual([]);
    expect(result.events).toEqual([]);
    expect(result.ending).toBe(input.ending);
  });

  it("rejects unsupported actions", () => {
    expect(() =>
      resolveTurn(createState(), createAction({ kind: "build_institution" })),
    ).toThrow("only supports shift_doctrine");
  });

  it("returns state and result accepted by the boundary validators", () => {
    const { state, result } = resolveTurn(createState(), createAction());

    expect(() => assertValidGameState(state)).not.toThrow();
    expect(() => assertValidTurnResult(result)).not.toThrow();
  });
});
