import type { GameState, Percentage, TurnResult } from "../domain";

const METRIC_MIN = 0;
const METRIC_MAX = 100;

export interface ProjectMetricResolution {
  readonly state: GameState;
  readonly result: TurnResult;
}

function clampMetric(value: number): Percentage {
  return Math.max(METRIC_MIN, Math.min(METRIC_MAX, value)) as Percentage;
}

/**
 * Applies the placeholder project-metric derivation for an accepted doctrine shift.
 */
export function updateProjectMetrics(
  state: GameState,
  result: TurnResult,
): ProjectMetricResolution {
  const action = result.acceptedPlayerAction;

  if (action.kind !== "shift_doctrine") {
    return { state, result };
  }

  const direction = action.parameters.direction === "increase" ? 1 : -1;
  const beforeMobilization = state.playerProject.metrics.mobilization;
  const beforeLegitimacy = state.playerProject.metrics.legitimacy;
  const afterMobilization = clampMetric(beforeMobilization + direction);
  const afterLegitimacy = clampMetric(beforeLegitimacy - direction);
  const actionCause = { kind: "action" as const, id: action.id };

  return {
    state: {
      ...state,
      playerProject: {
        ...state.playerProject,
        metrics: {
          ...state.playerProject.metrics,
          mobilization: afterMobilization,
          legitimacy: afterLegitimacy,
        },
      },
    },
    result: {
      ...result,
      changes: [
        ...result.changes,
        {
          target: { kind: "project", id: state.playerProject.id },
          field: "state-field:project-metric-mobilization",
          before: beforeMobilization,
          after: afterMobilization,
          causes: [actionCause],
        },
        {
          target: { kind: "project", id: state.playerProject.id },
          field: "state-field:project-metric-legitimacy",
          before: beforeLegitimacy,
          after: afterLegitimacy,
          causes: [actionCause],
        },
      ],
    },
  };
}
