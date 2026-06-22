import { describe, expect, it, vi } from "vitest";

import { createMinimalInitialGameState } from "../src/content";
import {
  assertValidPlayerAction,
  type GameState,
} from "../src/game-core/domain";
import { resolveTurn } from "../src/game-core/simulation";
import {
  createManualActionOptions,
  resolveManualActionOption,
} from "../src/ui/dev-loop/actionOptions";

function optionById(state: GameState, id: string) {
  const option = createManualActionOptions(state).find(
    (candidate) => candidate.id === id,
  );
  if (option === undefined) {
    throw new Error(`Missing manual action option ${id}`);
  }
  return option;
}

describe("manual development-loop action options", () => {
  it("creates enabled increase and decrease options for the first ideology axis", () => {
    const state = createMinimalInitialGameState();
    const increase = optionById(state, "shift-doctrine-increase");
    const decrease = optionById(state, "shift-doctrine-decrease");

    expect(increase.enabled).toBe(true);
    expect(decrease.enabled).toBe(true);
    expect(increase.action).toMatchObject({
      kind: "shift_doctrine",
      parameters: {
        axisId: state.playerProject.ideology.axes[0].id,
        direction: "increase",
        magnitude: 10,
      },
    });
    expect(decrease.action).toMatchObject({
      kind: "shift_doctrine",
      parameters: {
        axisId: state.playerProject.ideology.axes[0].id,
        direction: "decrease",
        magnitude: 10,
      },
    });
  });

  it("produces structurally valid shift actions", () => {
    const state = createMinimalInitialGameState();
    const shiftOptions = createManualActionOptions(state).filter(
      (option) => option.action.kind === "shift_doctrine",
    );

    for (const option of shiftOptions) {
      expect(() => assertValidPlayerAction(option.action, state)).not.toThrow();
    }
  });

  it("includes disabled, structurally valid non-shift placeholders with reasons", () => {
    const state = createMinimalInitialGameState();
    const placeholders = createManualActionOptions(state).filter(
      (option) => option.action.kind !== "shift_doctrine",
    );

    expect(placeholders.map((option) => option.action.kind)).toEqual([
      "build_institution",
      "seek_detente",
    ]);
    for (const option of placeholders) {
      expect(option.enabled).toBe(false);
      expect(option.disabledReason).toMatch(/does not support consequences/);
      expect(() => assertValidPlayerAction(option.action, state)).not.toThrow();
    }
  });

  it("disables doctrine shifts with a reason when no ideology axis is available", () => {
    const validState = createMinimalInitialGameState();
    const stateWithoutAxes = {
      ...validState,
      playerProject: {
        ...validState.playerProject,
        ideology: { ...validState.playerProject.ideology, axes: [] },
      },
    } satisfies GameState;
    const shiftOptions = createManualActionOptions(stateWithoutAxes).filter(
      (option) => option.action.kind === "shift_doctrine",
    );

    expect(shiftOptions).toHaveLength(2);
    expect(shiftOptions.every((option) => !option.enabled)).toBe(true);
    expect(shiftOptions.every((option) => option.disabledReason?.includes("no ideology axis"))).toBe(
      true,
    );
    for (const option of shiftOptions) {
      expect(() => assertValidPlayerAction(option.action, stateWithoutAxes)).not.toThrow();
    }
  });

  it.each([
    ["shift-doctrine-increase", 10],
    ["shift-doctrine-decrease", -10],
  ])("resolves the enabled %s option", (optionId, positionDelta) => {
    const state = createMinimalInitialGameState();
    const resolution = resolveTurn(state, optionById(state, optionId).action);

    expect(resolution.state.playerProject.ideology.axes[0].position).toBe(
      state.playerProject.ideology.axes[0].position + positionDelta,
    );
  });

  it("does not invoke the resolver for a disabled option", () => {
    const state = createMinimalInitialGameState();
    const option = optionById(state, "build-institution-placeholder");
    const resolver = vi.fn(resolveTurn);

    expect(resolveManualActionOption(state, option, resolver)).toBeNull();
    expect(resolver).not.toHaveBeenCalled();
  });
});
