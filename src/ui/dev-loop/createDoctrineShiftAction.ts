import type { GameState, PlayerAction } from "../../game-core/domain";

export function createDoctrineShiftAction(state: GameState): PlayerAction {
  const axis = state.playerProject.ideology.axes[0];
  if (axis === undefined) {
    throw new Error("Cannot construct doctrine shift without an ideology axis");
  }

  return {
    id: "action:bare-development-doctrine-shift",
    actorProjectId: state.playerProject.id,
    actorRole: "player",
    kind: "shift_doctrine",
    targets: [{ kind: "project", id: state.playerProject.id }],
    parameters: {
      axisId: axis.id,
      direction: "increase",
      magnitude: 10,
    },
  };
}
