import type { GameState, PlayerAction, TurnResult } from "../domain";
import { assertValidGameState, assertValidPlayerAction } from "../domain";
import { resolveTurn } from "../simulation";

export interface ScriptedSessionResult {
  readonly initialState: GameState;
  readonly finalState: GameState;
  readonly turnResults: readonly TurnResult[];
}

/** Resolves an ordered action sequence through the public deterministic turn pipeline. */
export function runScriptedSession(
  initialState: GameState,
  actions: readonly PlayerAction[],
): ScriptedSessionResult {
  assertValidGameState(initialState);

  let currentState = initialState;
  const turnResults: TurnResult[] = [];

  for (const action of actions) {
    assertValidPlayerAction(action, currentState);
    const resolution = resolveTurn(currentState, action);
    currentState = resolution.state;
    turnResults.push(resolution.result);
  }

  return {
    initialState,
    finalState: currentState,
    turnResults,
  };
}
