import type { PlayerAction } from "../../game-core/domain";
import {
  runScriptedSession,
  type ScriptedSessionResult,
} from "../../game-core/session";
import { createMinimalInitialGameState } from "./initialGameState";

const SCRIPTED_DIRECTIONS = [
  "increase",
  "increase",
  "decrease",
  "increase",
  "decrease",
  "decrease",
  "increase",
  "increase",
  "decrease",
  "increase",
] as const;

export function createMinimalScriptedActions(): readonly PlayerAction[] {
  const initialState = createMinimalInitialGameState();
  const playerProjectId = initialState.playerProject.id;
  const axis = initialState.playerProject.ideology.axes[0];

  if (axis === undefined) {
    throw new Error("Minimal scripted session requires a player ideology axis");
  }

  return SCRIPTED_DIRECTIONS.map((direction, index) => ({
    id: `action:scripted-turn-${index + 1}-shift-${direction}`,
    actorProjectId: playerProjectId,
    actorRole: "player",
    kind: "shift_doctrine",
    targets: [{ kind: "project", id: playerProjectId }],
    parameters: {
      axisId: axis.id,
      direction,
      magnitude: 10,
    },
  }));
}

export function runMinimalScriptedSession(): ScriptedSessionResult {
  return runScriptedSession(
    createMinimalInitialGameState(),
    createMinimalScriptedActions(),
  );
}
