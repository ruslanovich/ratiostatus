"use client";

import { useState } from "react";

import { createMinimalInitialGameState } from "../../content";
import type { GameState, TurnResult } from "../../game-core/domain";
import {
  createManualActionOptions,
  type ManualActionOption,
  resolveManualActionOption,
} from "./actionOptions";

export function BareDevelopmentLoop() {
  const [gameState, setGameState] = useState<GameState>(() =>
    createMinimalInitialGameState(),
  );
  const [turnResult, setTurnResult] = useState<TurnResult | null>(null);

  const firstAxis = gameState.playerProject.ideology.axes[0];
  const rival = gameState.rivalProjects[0];
  const actionOptions = createManualActionOptions(gameState);

  function resolveAction(option: ManualActionOption) {
    const resolution = resolveManualActionOption(gameState, option);
    if (resolution === null) {
      return;
    }

    setGameState(resolution.state);
    setTurnResult(resolution.result);
  }

  return (
    <main className="dev-loop">
      <header>
        <p className="eyebrow">Manual action development slice</p>
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

      <section aria-labelledby="actions-heading" className="debug-panel">
        <h2 id="actions-heading">Manual action options</h2>
        <div className="action-options">
          {actionOptions.map((option) => (
            <article className="action-option" key={option.id}>
              <button
                type="button"
                onClick={() => resolveAction(option)}
                disabled={!option.enabled || turnResult !== null}
              >
                {option.label}
              </button>
              <p>{option.description}</p>
              {option.disabledReason !== undefined && (
                <p className="disabled-reason">Disabled: {option.disabledReason}</p>
              )}
            </article>
          ))}
        </div>
      </section>

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
            {turnResult.changes.map((change) => {
              const causalAction = change.causes.find(
                (cause) => cause.kind === "action",
              );

              return (
                <div key={`${change.target.id}-${change.field}`}>
                  <dt>{change.field}</dt>
                  <dd>
                    {change.before} → {change.after}; action:{" "}
                    {causalAction?.id ?? "Unavailable"}
                  </dd>
                </div>
              );
            })}
          </dl>
        )}
      </section>
    </main>
  );
}
