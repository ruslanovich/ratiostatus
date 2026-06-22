export const TURN_PHASES = [
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
] as const;

export type TurnPhaseName = (typeof TURN_PHASES)[number];
