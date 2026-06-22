import type { GameState, PlayerAction, TurnResult } from "../domain";
import {
  assertValidGameState,
  assertValidPlayerAction,
  assertValidTurnResult,
} from "../domain";
import { TURN_PHASES, type TurnPhaseName } from "./phases";
import { resolveDoctrineShift } from "./resolveDoctrineShift";

export interface TurnResolution {
  readonly state: GameState;
  readonly result: TurnResult;
}

interface TurnResolutionContext {
  readonly state: GameState;
  readonly action: PlayerAction;
  readonly result: TurnResult | null;
}

type TurnPhase = (context: TurnResolutionContext) => TurnResolutionContext;

function requireResult(context: TurnResolutionContext): TurnResult {
  if (context.result === null) {
    throw new Error("Turn pipeline did not produce a result");
  }

  return context.result;
}

const validateInput: TurnPhase = (context) => {
  assertValidGameState(context.state);
  assertValidPlayerAction(context.action, context.state);
  return context;
};

const applyPlayerAction: TurnPhase = (context) => {
  if (context.action.kind !== "shift_doctrine") {
    throw new Error("Turn resolver only supports shift_doctrine actions");
  }

  const resolution = resolveDoctrineShift(context.state, context.action);
  return { ...context, ...resolution };
};

const preserveContext: TurnPhase = (context) => context;

const validateOutput: TurnPhase = (context) => {
  assertValidGameState(context.state);
  assertValidTurnResult(requireResult(context));
  return context;
};

const PHASE_HANDLERS: Readonly<Record<TurnPhaseName, TurnPhase>> = {
  validate_input: validateInput,
  apply_player_action: applyPlayerAction,
  update_project_metrics: preserveContext,
  update_factions: preserveContext,
  update_contradictions: preserveContext,
  update_external_relations: preserveContext,
  select_rival_actions: preserveContext,
  generate_events: preserveContext,
  validate_output: validateOutput,
  check_ending: preserveContext,
  build_turn_result: preserveContext,
};

/** Resolves one player action through the explicit deterministic turn phases. */
export function resolveTurn(
  state: GameState,
  action: PlayerAction,
): TurnResolution {
  let context: TurnResolutionContext = { state, action, result: null };

  for (const phase of TURN_PHASES) {
    context = PHASE_HANDLERS[phase](context);
  }

  return { state: context.state, result: requireResult(context) };
}
