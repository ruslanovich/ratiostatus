import type { CivilizationalProject, GameState } from "../../game-core/domain";
import { provisionalArchetype } from "./provisionalArchetype";
import { provisionalRival } from "./provisionalRival";
import type { MinimalContent } from "./types";
import { assertValidMinimalContent } from "./validation";

export const minimalContent = {
  archetype: provisionalArchetype,
  rival: provisionalRival,
} as const satisfies MinimalContent;

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

  return {
    id: "game:minimal-provisional-session",
    turn: 0,
    turnLimit: 10,
    playerProject,
    rivalProjects: [content.rival.project],
    activeEventIds: [],
    history: [],
    ending: null,
  };
}
