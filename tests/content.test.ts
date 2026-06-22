import { describe, expect, it } from "vitest";

import {
  assertValidMinimalContent,
  createMinimalInitialGameState,
  minimalContent,
} from "../src/content";
import type { MinimalContent } from "../src/content";
import type { PlayerAction } from "../src/game-core/domain";
import { resolveDoctrineShift } from "../src/game-core/simulation";

describe("minimal provisional content", () => {
  it("validates the single archetype and rival fixture", () => {
    expect(() => assertValidMinimalContent(minimalContent)).not.toThrow();
    expect(minimalContent.archetype.archetype.id).toMatch(/^archetype:/);
    expect(minimalContent.archetype.projectId).toMatch(/^project:/);
    expect(minimalContent.rival.project.id).toMatch(/^project:rival-/);
  });

  it("rejects an out-of-bounds ideology position", () => {
    const invalidContent = {
      ...minimalContent,
      archetype: {
        ...minimalContent.archetype,
        archetype: {
          ...minimalContent.archetype.archetype,
          initialIdeology: {
            ...minimalContent.archetype.archetype.initialIdeology,
            axes: [{ id: "ideology-axis:coordination", position: 101 }],
          },
        },
      },
    } satisfies MinimalContent;

    expect(() => assertValidMinimalContent(invalidContent)).toThrow("-100..100");
  });

  it("rejects an out-of-bounds percentage", () => {
    const invalidContent = {
      ...minimalContent,
      archetype: {
        ...minimalContent.archetype,
        institutions: [
          { ...minimalContent.archetype.institutions[0], strength: -1 },
        ],
      },
    } satisfies MinimalContent;

    expect(() => assertValidMinimalContent(invalidContent)).toThrow("0..100");
  });

  it("rejects missing archetype institution and faction references", () => {
    const missingInstitution = {
      ...minimalContent,
      archetype: {
        ...minimalContent.archetype,
        archetype: {
          ...minimalContent.archetype.archetype,
          initialInstitutionIds: ["institution:missing"],
        },
      },
    } satisfies MinimalContent;
    const missingFaction = {
      ...minimalContent,
      archetype: {
        ...minimalContent.archetype,
        archetype: {
          ...minimalContent.archetype.archetype,
          initialFactionIds: ["faction:missing"],
        },
      },
    } satisfies MinimalContent;

    expect(() => assertValidMinimalContent(missingInstitution)).toThrow(
      "missing institution",
    );
    expect(() => assertValidMinimalContent(missingFaction)).toThrow(
      "missing faction",
    );
  });

  it("initializes a legal minimal GameState", () => {
    const state = createMinimalInitialGameState();
    const projects = [state.playerProject, ...state.rivalProjects];

    expect(state.turn).toBe(0);
    expect(state.turnLimit).toBeGreaterThanOrEqual(10);
    expect(state.turnLimit).toBeLessThanOrEqual(12);
    expect(state.playerProject.role).toBe("player");
    expect(state.rivalProjects).toHaveLength(1);
    expect(state.rivalProjects[0]?.role).toBe("rival");
    expect(state.playerProject.ideology.axes.length).toBeGreaterThan(0);

    for (const project of projects) {
      for (const value of Object.values(project.metrics)) {
        expect(value).toBeGreaterThanOrEqual(0);
        expect(value).toBeLessThanOrEqual(100);
      }
    }
  });

  it("works with the existing doctrine-shift resolver", () => {
    const initialState = createMinimalInitialGameState();
    const action = {
      id: "action:minimal-doctrine-shift",
      actorProjectId: initialState.playerProject.id,
      actorRole: "player",
      kind: "shift_doctrine",
      targets: [{ kind: "project", id: initialState.playerProject.id }],
      parameters: {
        axisId: initialState.playerProject.ideology.axes[0].id,
        direction: "increase",
        magnitude: 10,
      },
    } satisfies PlayerAction;

    const resolution = resolveDoctrineShift(initialState, action);

    expect(resolution.state.turn).toBe(1);
    expect(resolution.state.playerProject.ideology.axes[0]?.position).toBe(20);
    expect(resolution.result.acceptedPlayerAction).toEqual(action);
  });
});
