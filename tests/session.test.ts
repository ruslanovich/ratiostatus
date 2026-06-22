import { describe, expect, it } from "vitest";

import {
  createMinimalInitialGameState,
  createMinimalScriptedActions,
  runMinimalScriptedSession,
} from "../src/content";
import type { PlayerAction } from "../src/game-core/domain";
import {
  assertValidGameState,
  assertValidTurnResult,
} from "../src/game-core/domain";
import { runScriptedSession } from "../src/game-core/session";

describe("scripted headless session", () => {
  it("resolves the fixed ten-turn sequence in order through the public pipeline", () => {
    const initialState = createMinimalInitialGameState();
    const actions = createMinimalScriptedActions();
    const session = runScriptedSession(initialState, actions);

    expect(session.initialState).toBe(initialState);
    expect(session.turnResults).toHaveLength(10);
    expect(session.finalState.turn).toBe(10);
    expect(session.finalState.history).toHaveLength(10);
    expect(session.finalState.history).toEqual(
      session.turnResults.map((result) => result.id),
    );
    expect(session.turnResults.map((result) => result.turn)).toEqual([
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
    ]);
  });

  it("is deterministic for identical state and action inputs", () => {
    const initialState = createMinimalInitialGameState();
    const actions = createMinimalScriptedActions();

    expect(runScriptedSession(initialState, actions)).toEqual(
      runScriptedSession(initialState, actions),
    );
  });

  it("does not mutate the initial state or action list", () => {
    const initialState = createMinimalInitialGameState();
    const actions = createMinimalScriptedActions();
    const stateSnapshot = structuredClone(initialState);
    const actionsSnapshot = structuredClone(actions);

    runScriptedSession(initialState, actions);

    expect(initialState).toEqual(stateSnapshot);
    expect(actions).toEqual(actionsSnapshot);
  });

  it("retains doctrine and metric changes produced by every resolved turn", () => {
    const session = runMinimalScriptedSession();

    for (const result of session.turnResults) {
      expect(result.changes.map((change) => change.field)).toEqual([
        "state-field:ideology-axis-position-coordination",
        "state-field:project-metric-mobilization",
        "state-field:project-metric-legitimacy",
      ]);
      expect(() => assertValidTurnResult(result)).not.toThrow();
    }
  });

  it("runs the minimal fixture helper for exactly ten turns with valid output", () => {
    const session = runMinimalScriptedSession();

    expect(createMinimalScriptedActions()).toHaveLength(10);
    expect(session.initialState.turn).toBe(0);
    expect(session.finalState.turn).toBe(10);
    expect(session.turnResults).toHaveLength(10);
    expect(session.finalState.playerProject.ideology.axes[0]?.position).toBe(30);
    expect(session.finalState.playerProject.metrics).toMatchObject({
      mobilization: 52,
      legitimacy: 48,
    });
    expect(() => assertValidGameState(session.finalState)).not.toThrow();
  });

  it("rejects an action from a project other than the current player", () => {
    const actions = createMinimalScriptedActions();
    const invalidAction: PlayerAction = {
      ...actions[0]!,
      actorProjectId: "project:not-the-player",
    };

    expect(() =>
      runScriptedSession(createMinimalInitialGameState(), [invalidAction]),
    ).toThrow("actor must match the player project");
  });

  it("does not swallow unsupported-action errors from the resolver", () => {
    const initialState = createMinimalInitialGameState();
    const unsupportedAction: PlayerAction = {
      id: "action:scripted-unsupported-institution",
      actorProjectId: initialState.playerProject.id,
      actorRole: "player",
      kind: "build_institution",
      targets: [
        { kind: "institution", id: "institution:deliberative-assembly" },
      ],
      parameters: {
        institutionId: "institution:deliberative-assembly",
        category: "governance",
      },
    };

    expect(() => runScriptedSession(initialState, [unsupportedAction])).toThrow(
      "only supports shift_doctrine",
    );
  });

  it("validates the initial state before resolving actions", () => {
    const initialState = createMinimalInitialGameState();
    const invalidState = { ...initialState, turn: 13 } as typeof initialState;

    expect(() => runScriptedSession(invalidState, [])).toThrow(
      "state.turn must be a finite integer within 0..12",
    );
  });
});
