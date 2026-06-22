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

function createState(
  position = 10,
  metrics: Partial<GameState["playerProject"]["metrics"]> = {},
): GameState {
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
        ...metrics,
      },
    },
    rivalProjects: [],
    activeEventIds: [],
    history: [],
    ending: null,
  };
}

type ShiftDoctrineAction = Extract<PlayerAction, { kind: "shift_doctrine" }>;

function createAction(
  overrides: Partial<Omit<ShiftDoctrineAction, "parameters">> & {
    parameters?: Partial<ShiftDoctrineAction["parameters"]>;
  } = {},
): ShiftDoctrineAction {
  const { parameters, ...baseOverrides } = overrides;
  return {
    id: "action:turn-one-player",
    actorProjectId: "project:player",
    actorRole: "player",
    kind: "shift_doctrine",
    targets: [{ kind: "project", id: "project:player" }],
    parameters: {
      axisId: "ideology-axis:coordination",
      direction: "increase",
      magnitude: 15,
      ...parameters,
    },
    ...baseOverrides,
  };
}

function createBuildInstitutionAction(): Extract<
  PlayerAction,
  { kind: "build_institution" }
> {
  return {
    id: "action:build-institution",
    actorProjectId: "project:player",
    actorRole: "player",
    kind: "build_institution",
    targets: [{ kind: "institution", id: "institution:public-forum" }],
    parameters: {
      institutionId: "institution:public-forum",
      category: "governance",
    },
  };
}

describe("resolveDoctrineShift", () => {
  it("increases the selected ideology axis", () => {
    const input = createState();
    const { state, result } = resolveDoctrineShift(
      input,
      createAction({ parameters: { axisId: "ideology-axis:openness" } }),
    );

    expect(state.playerProject.ideology.axes[0]?.position).toBe(10);
    expect(state.playerProject.ideology.axes[1]?.position).toBe(-5);
    expect(state.turn).toBe(1);
    expect(state.history).toEqual([result.id]);
    expect(result.turn).toBe(1);
  });

  it("decreases the selected ideology axis", () => {
    const { state } = resolveDoctrineShift(
      createState(),
      createAction({
        parameters: {
          axisId: "ideology-axis:openness",
          direction: "decrease",
          magnitude: 10,
        },
      }),
    );

    expect(state.playerProject.ideology.axes[0]?.position).toBe(10);
    expect(state.playerProject.ideology.axes[1]?.position).toBe(-30);
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

  it("clamps an increase to 100", () => {
    const { state, result } = resolveDoctrineShift(
      createState(95),
      createAction({ parameters: { magnitude: 20 } }),
    );

    expect(state.playerProject.ideology.axes[0]?.position).toBe(100);
    expect(result.changes[0]?.after).toBe(100);
  });

  it("clamps a decrease to -100", () => {
    const { state, result } = resolveDoctrineShift(
      createState(-95),
      createAction({ parameters: { direction: "decrease", magnitude: 20 } }),
    );

    expect(state.playerProject.ideology.axes[0]?.position).toBe(-100);
    expect(result.changes[0]?.after).toBe(-100);
  });

  it("rejects an unknown ideology axis", () => {
    expect(() =>
      resolveDoctrineShift(
        createState(),
        createAction({ parameters: { axisId: "ideology-axis:unknown" } }),
      ),
    ).toThrow("unknown ideology axis ideology-axis:unknown");
  });

  it("rejects a non-shift action", () => {
    expect(() =>
      resolveDoctrineShift(
        createState(),
        createBuildInstitutionAction(),
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

  it("rejects a state without a player ideology axis during state validation", () => {
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

  it("returns one causal state change referencing the action and selected axis", () => {
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

  it("does not apply the turn-pipeline metric derivation directly", () => {
    const input = createState();
    const { state, result } = resolveDoctrineShift(input, createAction());

    expect(state.playerProject.metrics).toBe(input.playerProject.metrics);
    expect(result.changes).toHaveLength(1);
    expect(result.changes[0]?.field).toBe(
      "state-field:ideology-axis-position-coordination",
    );
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

  it("derives increase metrics after resolving the doctrine shift", () => {
    const state = createState();
    const action = createAction();
    const { state: nextState, result } = resolveTurn(state, action);

    expect(nextState.playerProject.ideology.axes[0]?.position).toBe(25);
    expect(nextState.playerProject.metrics.mobilization).toBe(51);
    expect(nextState.playerProject.metrics.legitimacy).toBe(49);
    expect(result.changes.map((change) => change.field)).toEqual([
      "state-field:ideology-axis-position-coordination",
      "state-field:project-metric-mobilization",
      "state-field:project-metric-legitimacy",
    ]);
  });

  it("derives decrease metrics after resolving the doctrine shift", () => {
    const state = createState();
    const action = createAction({
      parameters: { direction: "decrease", magnitude: 15 },
    });
    const { state: nextState, result } = resolveTurn(state, action);

    expect(nextState.playerProject.ideology.axes[0]?.position).toBe(-5);
    expect(nextState.playerProject.metrics.mobilization).toBe(49);
    expect(nextState.playerProject.metrics.legitimacy).toBe(51);
    expect(
      result.changes.slice(1).map(({ before, after }) => ({ before, after })),
    ).toEqual([
      { before: 50, after: 49 },
      { before: 50, after: 51 },
    ]);
  });

  it("clamps derived project metrics to 0..100", () => {
    const upper = resolveTurn(
      createState(10, { mobilization: 100, legitimacy: 0 }),
      createAction(),
    );
    const lower = resolveTurn(
      createState(10, { mobilization: 0, legitimacy: 100 }),
      createAction({ parameters: { direction: "decrease" } }),
    );

    expect(upper.state.playerProject.metrics).toMatchObject({
      mobilization: 100,
      legitimacy: 0,
    });
    expect(
      upper.result.changes.slice(1).map((change) => change.after),
    ).toEqual([100, 0]);
    expect(lower.state.playerProject.metrics).toMatchObject({
      mobilization: 0,
      legitimacy: 100,
    });
    expect(
      lower.result.changes.slice(1).map((change) => change.after),
    ).toEqual([0, 100]);
  });

  it("appends metric changes caused by the accepted player action", () => {
    const action = createAction();
    const { result } = resolveTurn(createState(), action);

    expect(result.changes.slice(1)).toEqual([
      {
        target: { kind: "project", id: "project:player" },
        field: "state-field:project-metric-mobilization",
        before: 50,
        after: 51,
        causes: [{ kind: "action", id: action.id }],
      },
      {
        target: { kind: "project", id: "project:player" },
        field: "state-field:project-metric-legitimacy",
        before: 50,
        after: 49,
        causes: [{ kind: "action", id: action.id }],
      },
    ]);
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

  it("preserves state outside the doctrine and project-metric phases", () => {
    const input = createState();
    const { state, result } = resolveTurn(input, createAction());

    expect(state.playerProject.metrics.productivity).toBe(
      input.playerProject.metrics.productivity,
    );
    expect(state.playerProject.metrics.innovation).toBe(
      input.playerProject.metrics.innovation,
    );
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
      resolveTurn(createState(), createBuildInstitutionAction()),
    ).toThrow("only supports shift_doctrine");
  });

  it("returns state and result accepted by the boundary validators", () => {
    const { state, result } = resolveTurn(createState(), createAction());

    expect(() => assertValidGameState(state)).not.toThrow();
    expect(() => assertValidTurnResult(result)).not.toThrow();
  });
});
