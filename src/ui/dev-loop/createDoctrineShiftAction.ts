import type { GameState, PlayerAction } from "../../game-core/domain";

export function createDoctrineShiftAction(state: GameState): PlayerAction {
  return {
    id: "action:bare-development-doctrine-shift",
    actorProjectId: state.playerProject.id,
    actorRole: "player",
    kind: "shift_doctrine",
    targets: [{ kind: "project", id: state.playerProject.id }],
  };
}
