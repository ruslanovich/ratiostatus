import type {
  GameState,
  PlayerAction,
  SignedPercentage,
  TurnResult,
  TurnResultId,
} from "../domain";
import {
  assertValidGameState,
  assertValidPlayerAction,
  assertValidTurnResult,
} from "../domain";

const IDEOLOGY_POSITION_MAX = 100;
const IDEOLOGY_POSITION_MIN = -100;

export interface DoctrineShiftResolution {
  readonly state: GameState;
  readonly result: TurnResult;
}

/**
 * Resolves a doctrine shift against the selected player ideology axis.
 */
export function resolveDoctrineShift(
  state: GameState,
  action: PlayerAction,
): DoctrineShiftResolution {
  assertValidGameState(state);
  assertValidPlayerAction(action, state);

  if (action.kind !== "shift_doctrine") {
    throw new Error("Doctrine shift resolver only accepts shift_doctrine actions");
  }

  if (action.actorRole !== "player") {
    throw new Error("Doctrine shift action must have the player actor role");
  }

  if (action.actorProjectId !== state.playerProject.id) {
    throw new Error("Doctrine shift actor must match the player project");
  }

  const axis = state.playerProject.ideology.axes.find(
    (candidate) => candidate.id === action.parameters.axisId,
  );

  if (axis === undefined) {
    throw new Error(`Doctrine shift references unknown ideology axis ${action.parameters.axisId}`);
  }

  const signedMagnitude =
    action.parameters.direction === "increase"
      ? action.parameters.magnitude
      : -action.parameters.magnitude;
  const nextPosition = Math.max(
    IDEOLOGY_POSITION_MIN,
    Math.min(IDEOLOGY_POSITION_MAX, axis.position + signedMagnitude),
  ) as SignedPercentage;
  const nextTurn = state.turn + 1;
  const resultId = `turn-result:${state.id.slice("game:".length)}-${nextTurn}-${action.id.slice("action:".length)}` as TurnResultId;

  const result: TurnResult = {
    id: resultId,
    turn: nextTurn,
    acceptedPlayerAction: action,
    aiActions: [],
    changes: [
      {
        target: { kind: "project", id: state.playerProject.id },
        field: `state-field:ideology-axis-position-${axis.id.slice("ideology-axis:".length)}`,
        before: axis.position,
        after: nextPosition,
        causes: [{ kind: "action", id: action.id }],
      },
    ],
    events: [],
    ending: state.ending,
  };

  const nextState: GameState = {
    ...state,
    turn: nextTurn,
    playerProject: {
      ...state.playerProject,
      ideology: {
        ...state.playerProject.ideology,
        axes: state.playerProject.ideology.axes.map((candidate) =>
          candidate.id === axis.id ? { ...candidate, position: nextPosition } : candidate,
        ),
      },
    },
    history: [...state.history, resultId],
  };

  assertValidGameState(nextState);
  assertValidTurnResult(result);

  return { state: nextState, result };
}
