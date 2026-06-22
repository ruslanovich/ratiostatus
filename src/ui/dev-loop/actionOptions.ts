import {
  assertValidPlayerAction,
  type GameState,
  type PlayerAction,
} from "../../game-core/domain";
import {
  resolveTurn,
  type TurnResolution,
} from "../../game-core/simulation";

export interface ManualActionOption {
  readonly id: string;
  readonly label: string;
  readonly description: string;
  readonly action: PlayerAction;
  readonly enabled: boolean;
  readonly disabledReason?: string;
}

export type ManualActionResolver = (
  state: GameState,
  action: PlayerAction,
) => TurnResolution;

const UNSUPPORTED_ACTION_REASON =
  "The turn resolver does not support consequences for this action yet.";
const MISSING_AXIS_REASON =
  "The player project has no ideology axis available for doctrine shifts.";

function validatedOption(
  state: GameState,
  option: ManualActionOption,
): ManualActionOption {
  assertValidPlayerAction(option.action, state);
  return option;
}

export function createManualActionOptions(
  state: GameState,
): readonly ManualActionOption[] {
  const playerProjectId = state.playerProject.id;
  const firstAxis = state.playerProject.ideology.axes[0];
  const axisId = firstAxis?.id ?? "ideology-axis:unavailable";
  const shiftEnabled = firstAxis !== undefined;
  const firstRivalProjectId = state.rivalProjects[0]?.id ?? playerProjectId;

  const options: readonly ManualActionOption[] = [
    {
      id: "shift-doctrine-increase",
      label: "Increase first doctrine axis",
      description: `Increase ${axisId} by 10.`,
      action: {
        id: "action:manual-shift-doctrine-increase",
        actorProjectId: playerProjectId,
        actorRole: "player",
        kind: "shift_doctrine",
        targets: [{ kind: "project", id: playerProjectId }],
        parameters: { axisId, direction: "increase", magnitude: 10 },
      },
      enabled: shiftEnabled,
      ...(!shiftEnabled && { disabledReason: MISSING_AXIS_REASON }),
    },
    {
      id: "shift-doctrine-decrease",
      label: "Decrease first doctrine axis",
      description: `Decrease ${axisId} by 10.`,
      action: {
        id: "action:manual-shift-doctrine-decrease",
        actorProjectId: playerProjectId,
        actorRole: "player",
        kind: "shift_doctrine",
        targets: [{ kind: "project", id: playerProjectId }],
        parameters: { axisId, direction: "decrease", magnitude: 10 },
      },
      enabled: shiftEnabled,
      ...(!shiftEnabled && { disabledReason: MISSING_AXIS_REASON }),
    },
    {
      id: "build-institution-placeholder",
      label: "Build institution",
      description: "Create a provisional governance institution.",
      action: {
        id: "action:manual-build-institution-placeholder",
        actorProjectId: playerProjectId,
        actorRole: "player",
        kind: "build_institution",
        targets: [{ kind: "project", id: playerProjectId }],
        parameters: {
          institutionId: "institution:manual-placeholder",
          category: "governance",
        },
      },
      enabled: false,
      disabledReason: UNSUPPORTED_ACTION_REASON,
    },
    {
      id: "seek-detente-placeholder",
      label: "Seek detente",
      description: `Seek a provisional trade understanding with ${firstRivalProjectId}.`,
      action: {
        id: "action:manual-seek-detente-placeholder",
        actorProjectId: playerProjectId,
        actorRole: "player",
        kind: "seek_detente",
        targets: [{ kind: "project", id: firstRivalProjectId }],
        parameters: {
          targetProjectId: firstRivalProjectId,
          basis: "trade",
        },
      },
      enabled: false,
      disabledReason: UNSUPPORTED_ACTION_REASON,
    },
  ];

  return options.map((option) => validatedOption(state, option));
}

export function resolveManualActionOption(
  state: GameState,
  option: ManualActionOption,
  resolver: ManualActionResolver = resolveTurn,
): TurnResolution | null {
  if (!option.enabled) {
    return null;
  }

  return resolver(state, option.action);
}
