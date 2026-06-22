import {
  assertValidGameState,
  type CivilizationalProject,
  type GameState,
} from "../../game-core/domain";
import { provisionalArchetype } from "./provisionalArchetype";
import { getMinimalArchetypeById, minimalArchetypes } from "./archetypeCatalog";
import { provisionalRival } from "./provisionalRival";
import type { MinimalContent } from "./types";
import {
  assertValidMinimalArchetypeCatalog,
  assertValidMinimalContent,
} from "./validation";

export const minimalContent = {
  archetype: provisionalArchetype,
  rival: provisionalRival,
} as const satisfies MinimalContent;

assertValidMinimalArchetypeCatalog(minimalArchetypes);

export function createMinimalInitialGameState(
  content: MinimalContent = minimalContent,
): GameState {
  assertValidMinimalContent(content);

  const playerProject: CivilizationalProject & { readonly role: "player" } = {
    id: content.archetype.projectId,
    role: content.archetype.role,
    originArchetypeId: content.archetype.archetype.id,
    ideology: content.archetype.archetype.initialIdeology,
    institutions: content.archetype.institutions,
    factions: content.archetype.factions,
    contradictions: [],
    relations: [],
    metrics: content.archetype.metrics,
  };

  const state: GameState = {
    id: "game:minimal-provisional-session",
    turn: 0,
    turnLimit: 10,
    playerProject,
    rivalProjects: [content.rival.project],
    activeEventIds: [],
    history: [],
    ending: null,
  };

  assertValidGameState(state);
  return state;
}

export function createMinimalInitialGameStateForArchetype(
  archetypeId: Parameters<typeof getMinimalArchetypeById>[0],
): GameState {
  const archetype = getMinimalArchetypeById(archetypeId);

  if (archetype === undefined) {
    throw new Error(`Unknown minimal archetype ID: ${archetypeId}`);
  }

  return createMinimalInitialGameState({
    archetype,
    rival: provisionalRival,
  });
}
