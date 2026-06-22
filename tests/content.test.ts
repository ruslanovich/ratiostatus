import { describe, expect, it } from "vitest";

import {
  assertValidMinimalArchetype,
  assertValidMinimalArchetypeCatalog,
  assertValidMinimalContent,
  createMinimalInitialGameState,
  createMinimalInitialGameStateForArchetype,
  getMinimalArchetypeById,
  minimalArchetypes,
  minimalContent,
} from "../src/content";
import type { MinimalContent } from "../src/content";
import {
  assertValidGameState,
  type ArchetypeId,
  type PlayerAction,
} from "../src/game-core/domain";
import { resolveDoctrineShift } from "../src/game-core/simulation";

describe("minimal archetype content", () => {
  it("validates the default archetype and rival fixture", () => {
    expect(() => assertValidMinimalContent(minimalContent)).not.toThrow();
    expect(minimalContent.archetype.archetype.id).toMatch(/^archetype:/);
    expect(minimalContent.archetype.projectId).toMatch(/^project:/);
    expect(minimalContent.rival.project.id).toMatch(/^project:rival-/);
  });

  it("provides at least five archetypes with unique archetype and project IDs", () => {
    const archetypeIds = minimalArchetypes.map(({ archetype }) => archetype.id);
    const projectIds = minimalArchetypes.map(({ projectId }) => projectId);

    expect(minimalArchetypes.length).toBeGreaterThanOrEqual(5);
    expect(new Set(archetypeIds).size).toBe(archetypeIds.length);
    expect(new Set(projectIds).size).toBe(projectIds.length);
    expect(() => assertValidMinimalArchetypeCatalog(minimalArchetypes)).not.toThrow();
  });

  it("validates every archetype and all local references", () => {
    for (const content of minimalArchetypes) {
      const institutionIds = new Set(content.institutions.map(({ id }) => id));
      const factionIds = new Set(content.factions.map(({ id }) => id));

      expect(() => assertValidMinimalArchetype(content)).not.toThrow();
      expect(content.archetype.initialIdeology.axes.length).toBeGreaterThan(0);
      expect(content.institutions.length).toBeGreaterThan(0);
      expect(content.factions.length).toBeGreaterThan(0);

      for (const id of content.archetype.initialInstitutionIds) {
        expect(institutionIds.has(id)).toBe(true);
      }
      for (const id of content.archetype.initialFactionIds) {
        expect(factionIds.has(id)).toBe(true);
      }
      for (const faction of content.factions) {
        for (const id of faction.institutionIds) {
          expect(institutionIds.has(id)).toBe(true);
        }
      }
    }
  });

  it("provides complete bounded project and faction metric records", () => {
    const projectMetricKeys = [
      "innovation",
      "legitimacy",
      "mobilization",
      "productivity",
    ];
    const factionMetricKeys = [
      "loyalty",
      "power",
      "radicalization",
      "support",
      "visibility",
    ];

    for (const content of minimalArchetypes) {
      expect(Object.keys(content.metrics).sort()).toEqual(projectMetricKeys);
      for (const value of Object.values(content.metrics)) {
        expect(value).toBeGreaterThanOrEqual(0);
        expect(value).toBeLessThanOrEqual(100);
      }

      for (const faction of content.factions) {
        expect(Object.keys(faction.metrics).sort()).toEqual(factionMetricKeys);
        for (const value of Object.values(faction.metrics)) {
          expect(value).toBeGreaterThanOrEqual(0);
          expect(value).toBeLessThanOrEqual(100);
        }
      }
    }
  });

  it("is mechanically varied across ideology, metrics, and institution categories", () => {
    const ideologyProfiles = new Set(
      minimalArchetypes.map(({ archetype }) =>
        JSON.stringify(archetype.initialIdeology),
      ),
    );
    const metricProfiles = new Set(
      minimalArchetypes.map(({ metrics }) => JSON.stringify(metrics)),
    );
    const institutionCategories = new Set(
      minimalArchetypes.flatMap(({ institutions }) =>
        institutions.map(({ category }) => category),
      ),
    );

    expect(ideologyProfiles.size).toBeGreaterThanOrEqual(2);
    expect(metricProfiles.size).toBeGreaterThanOrEqual(3);
    expect(institutionCategories.size).toBeGreaterThanOrEqual(3);
  });

  it("looks up archetypes and initializes a valid state for every catalog entry", () => {
    for (const content of minimalArchetypes) {
      expect(getMinimalArchetypeById(content.archetype.id)).toBe(content);

      const state = createMinimalInitialGameStateForArchetype(content.archetype.id);
      expect(state.playerProject.id).toBe(content.projectId);
      expect(state.playerProject.originArchetypeId).toBe(content.archetype.id);
      expect(state.playerProject.ideology).toEqual(content.archetype.initialIdeology);
      expect(state.rivalProjects).toEqual([minimalContent.rival.project]);
      expect(() => assertValidGameState(state)).not.toThrow();
    }
  });

  it("rejects an unknown archetype ID with a clear error", () => {
    expect(() =>
      createMinimalInitialGameStateForArchetype(
        "archetype:unknown-start" as ArchetypeId,
      ),
    ).toThrow("Unknown minimal archetype ID: archetype:unknown-start");
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

  it("keeps default initialization deterministic and on the provisional archetype", () => {
    expect(createMinimalInitialGameState()).toEqual(createMinimalInitialGameState());
    expect(createMinimalInitialGameState().playerProject.originArchetypeId).toBe(
      minimalContent.archetype.archetype.id,
    );
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
