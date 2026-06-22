import type {
  GameState,
  PlayerAction,
  SignedPercentage,
  TurnResult,
  TurnResultId,
} from "../domain";

const DEFAULT_DOCTRINE_SHIFT_INTENSITY = 10;
const IDEOLOGY_POSITION_MAX = 100;

export interface DoctrineShiftResolution {
  readonly state: GameState;
  readonly result: TurnResult;
}

/**
 * Resolves the deliberately minimal Task 3.1 doctrine shift: move the first
 * player ideology axis toward +100 by the action intensity.
 */
export function resolveDoctrineShift(
  state: GameState,
  action: PlayerAction,
): DoctrineShiftResolution {
  if (action.kind !== "shift_doctrine") {
    throw new Error("Doctrine shift resolver only accepts shift_doctrine actions");
  }

  if (action.actorRole !== "player") {
    throw new Error("Doctrine shift action must have the player actor role");
  }

  if (action.actorProjectId !== state.playerProject.id) {
    throw new Error("Doctrine shift actor must match the player project");
  }

  const [axis, ...remainingAxes] = state.playerProject.ideology.axes;

  if (axis === undefined) {
    throw new Error("Player project must have at least one ideology axis");
  }

  const intensity = action.intensity ?? DEFAULT_DOCTRINE_SHIFT_INTENSITY;
  const nextPosition = Math.min(
    IDEOLOGY_POSITION_MAX,
    axis.position + intensity,
  ) as SignedPercentage;
  const nextTurn = state.turn + 1;
  const resultId = `turn-result:${state.id}:${nextTurn}:${action.id}` as TurnResultId;

  const result: TurnResult = {
    id: resultId,
    turn: nextTurn,
    acceptedPlayerAction: action,
    aiActions: [],
    changes: [
      {
        target: { kind: "project", id: state.playerProject.id },
        field: `state-field:ideology-axis-position:${axis.id}`,
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
        axes: [{ ...axis, position: nextPosition }, ...remainingAxes],
      },
    },
    history: [...state.history, resultId],
  };

  return { state: nextState, result };
}
