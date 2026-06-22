"use client";

import { useState } from "react";

import { createMinimalInitialGameState } from "../../content";
import type { GameState, TurnResult } from "../../game-core/domain";
import { resolveDoctrineShift } from "../../game-core/simulation";
import { createDoctrineShiftAction } from "./createDoctrineShiftAction";

export function BareDevelopmentLoop() {
  const [gameState, setGameState] = useState<GameState>(() =>
    createMinimalInitialGameState(),
  );
  const [turnResult, setTurnResult] = useState<TurnResult | null>(null);

  const firstAxis = gameState.playerProject.ideology.axes[0];
  const rival = gameState.rivalProjects[0];
  const stateChange = turnResult?.changes[0];
  const causalAction = stateChange?.causes.find(
    (cause) => cause.kind === "action",
  );

  function resolveAction() {
    const action = createDoctrineShiftAction(gameState);
    const resolution = resolveDoctrineShift(gameState, action);

    setGameState(resolution.state);
    setTurnResult(resolution.result);
  }

  return (
    <main className="dev-loop">
      <header>
        <p className="eyebrow">Task 9.1 development slice</p>
        <h1>Ratio Status</h1>
        <p>
          Minimal fixture → structured action → deterministic core → turn result.
        </p>
      </header>

      <section aria-labelledby="state-heading" className="debug-panel">
        <h2 id="state-heading">Current state</h2>
        <dl>
          <div>
            <dt>Turn</dt>
            <dd>{gameState.turn}</dd>
          </div>
          <div>
            <dt>Player project</dt>
            <dd>{gameState.playerProject.id}</dd>
          </div>
          <div>
            <dt>First ideology axis</dt>
            <dd>{firstAxis?.id ?? "Unavailable"}</dd>
          </div>
          <div>
            <dt>Axis position</dt>
            <dd>{firstAxis?.position ?? "Unavailable"}</dd>
          </div>
          <div>
            <dt>Rival project</dt>
            <dd>{rival?.id ?? "Unavailable"}</dd>
          </div>
        </dl>
      </section>

      <button type="button" onClick={resolveAction} disabled={turnResult !== null}>
        Resolve doctrine shift
      </button>

      <section aria-labelledby="result-heading" className="debug-panel">
        <h2 id="result-heading">TurnResult</h2>
        {turnResult === null ? (
          <p>No turn resolved yet.</p>
        ) : (
          <dl>
            <div>
              <dt>Result id</dt>
              <dd>{turnResult.id}</dd>
            </div>
            <div>
              <dt>Accepted action kind</dt>
              <dd>{turnResult.acceptedPlayerAction.kind}</dd>
            </div>
            <div>
              <dt>Changed field</dt>
              <dd>{stateChange?.field ?? "Unavailable"}</dd>
            </div>
            <div>
              <dt>Before / after</dt>
              <dd>
                {stateChange === undefined
                  ? "Unavailable"
                  : `${stateChange.before} → ${stateChange.after}`}
              </dd>
            </div>
            <div>
              <dt>Causal action id</dt>
              <dd>{causalAction?.id ?? "Unavailable"}</dd>
            </div>
          </dl>
        )}
      </section>
    </main>
  );
}
