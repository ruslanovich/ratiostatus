import type {
  Faction,
  IdeologyProfile,
  Institution,
} from "../../game-core/domain";
import {
  assertPercentage,
  assertSignedPercentage,
  assertStableId,
} from "../../game-core/domain";
import type { MinimalArchetypeContent, MinimalContent } from "./types";

const INSTITUTION_CATEGORIES = new Set([
  "governance",
  "economic",
  "social",
  "security",
  "cultural",
]);
const PROJECT_METRICS = [
  "legitimacy",
  "productivity",
  "innovation",
  "mobilization",
] as const;
const FACTION_METRICS = [
  "power",
  "support",
  "loyalty",
  "visibility",
  "radicalization",
] as const;

function assertId(value: string, prefix: string): void {
  assertStableId(value, prefix, "Minimal content ID");
}

function assertIdeology(profile: IdeologyProfile, field: string): void {
  if (profile.axes.length === 0) {
    throw new Error(`${field} must have at least one ideology axis`);
  }

  for (const axis of profile.axes) {
    assertId(axis.id, "ideology-axis");
    assertSignedPercentage(axis.position, `${field} ideology position`);
  }

  for (const doctrineId of profile.doctrineCommitments) {
    assertId(doctrineId, "doctrine");
  }
}

function assertInstitutions(institutions: readonly Institution[], field: string): Set<string> {
  if (institutions.length === 0) {
    throw new Error(`${field} must have at least one institution`);
  }

  return new Set(
    institutions.map((institution) => {
      assertId(institution.id, "institution");
      if (!INSTITUTION_CATEGORIES.has(institution.category)) {
        throw new Error(`${field} institution category is invalid`);
      }
      assertPercentage(institution.strength, `${field} institution strength`);
      for (const ruleId of institution.ruleReferences) {
        assertId(ruleId, "rule");
      }
      return institution.id;
    }),
  );
}

function assertFactions(
  factions: readonly Faction[],
  institutionIds: ReadonlySet<string>,
  field: string,
): Set<string> {
  if (factions.length === 0) {
    throw new Error(`${field} must have at least one faction`);
  }

  return new Set(
    factions.map((faction) => {
      assertId(faction.id, "faction");
      for (const interestId of faction.interests) {
        assertId(interestId, "interest");
      }
      for (const metric of FACTION_METRICS) {
        assertPercentage(faction.metrics[metric], `${field} faction ${metric}`);
      }
      for (const institutionId of faction.institutionIds) {
        if (!institutionIds.has(institutionId)) {
          throw new Error(`${field} faction references missing institution ${institutionId}`);
        }
      }
      return faction.id;
    }),
  );
}

function assertMetrics(
  metrics: MinimalContent["archetype"]["metrics"],
  field: string,
): void {
  for (const metric of PROJECT_METRICS) {
    assertPercentage(metrics[metric], `${field} ${metric}`);
  }
}

export function assertValidMinimalContent(content: MinimalContent): void {
  const { archetype, rival } = content;

  assertValidMinimalArchetype(archetype);

  if (rival.project.role !== "rival") {
    throw new Error("Minimal rival project role must be rival");
  }

  assertId(rival.project.id, "project");
  assertId(rival.project.decisionPolicyId, "rival-policy");
  assertId(rival.project.originArchetypeId, "archetype");
  assertIdeology(rival.project.ideology, "Minimal rival");
  const rivalInstitutionIds = assertInstitutions(rival.project.institutions, "Minimal rival");
  assertFactions(rival.project.factions, rivalInstitutionIds, "Minimal rival");
  assertMetrics(rival.project.metrics, "Minimal rival metric");
}

export function assertValidMinimalArchetype(
  archetype: MinimalArchetypeContent,
): void {
  if (archetype.role !== "player") {
    throw new Error("Minimal archetype project role must be player");
  }

  assertId(archetype.projectId, "project");
  assertId(archetype.archetype.id, "archetype");
  assertIdeology(archetype.archetype.initialIdeology, "Minimal archetype");
  const institutionIds = assertInstitutions(archetype.institutions, "Minimal archetype");
  const factionIds = assertFactions(archetype.factions, institutionIds, "Minimal archetype");

  if (archetype.archetype.initialInstitutionIds.length === 0) {
    throw new Error("Archetype must reference at least one initial institution");
  }
  if (archetype.archetype.initialFactionIds.length === 0) {
    throw new Error("Archetype must reference at least one initial faction");
  }

  for (const id of archetype.archetype.initialInstitutionIds) {
    if (!institutionIds.has(id)) {
      throw new Error(`Archetype references missing institution ${id}`);
    }
  }
  for (const id of archetype.archetype.initialFactionIds) {
    if (!factionIds.has(id)) {
      throw new Error(`Archetype references missing faction ${id}`);
    }
  }
  for (const ruleId of archetype.archetype.constraintReferences) {
    assertId(ruleId, "rule");
  }
  assertMetrics(archetype.metrics, "Minimal archetype metric");
}

export function assertValidMinimalArchetypeCatalog(
  archetypes: readonly MinimalArchetypeContent[],
): void {
  if (archetypes.length < 5) {
    throw new Error("Minimal archetype catalog must contain at least five archetypes");
  }

  const archetypeIds = new Set<string>();
  const projectIds = new Set<string>();

  for (const archetype of archetypes) {
    assertValidMinimalArchetype(archetype);
    if (archetypeIds.has(archetype.archetype.id)) {
      throw new Error(`Duplicate archetype ID ${archetype.archetype.id}`);
    }
    if (projectIds.has(archetype.projectId)) {
      throw new Error(`Duplicate archetype project ID ${archetype.projectId}`);
    }
    archetypeIds.add(archetype.archetype.id);
    projectIds.add(archetype.projectId);
  }
}
