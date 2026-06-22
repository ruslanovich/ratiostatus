import type {
  Archetype,
  CivilizationalProject,
  Faction,
  Institution,
  RivalProject,
} from "../../game-core/domain";

export interface ProvisionalArchetypeContent {
  readonly projectId: CivilizationalProject["id"];
  readonly role: "player";
  readonly archetype: Archetype;
  readonly institutions: readonly Institution[];
  readonly factions: readonly Faction[];
  readonly metrics: CivilizationalProject["metrics"];
}

export interface ProvisionalRivalContent {
  readonly project: RivalProject;
}

export interface MinimalContent {
  readonly archetype: ProvisionalArchetypeContent;
  readonly rival: ProvisionalRivalContent;
}
