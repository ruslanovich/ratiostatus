import type {
  Faction,
  IdeologyProfile,
  Institution,
  Percentage,
} from "../../game-core/domain";
import type { MinimalContent } from "./types";

function assertId(value: string, prefix: string): void {
  const pattern = new RegExp(`^${prefix}:[a-z0-9]+(?:-[a-z0-9]+)*$`);

  if (!pattern.test(value)) {
    throw new Error(`Expected stable ${prefix}: ID, received ${value}`);
  }
}

function assertPercentage(value: Percentage, field: string): void {
  if (!Number.isFinite(value) || value < 0 || value > 100) {
    throw new Error(`${field} must be within 0..100`);
  }
}

function assertIdeology(profile: IdeologyProfile, field: string): void {
  if (profile.axes.length === 0) {
    throw new Error(`${field} must have at least one ideology axis`);
  }

  for (const axis of profile.axes) {
    assertId(axis.id, "ideology-axis");
    if (!Number.isFinite(axis.position) || axis.position < -100 || axis.position > 100) {
      throw new Error(`${field} ideology position must be within -100..100`);
    }
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
      for (const [metric, value] of Object.entries(faction.metrics)) {
        assertPercentage(value, `${field} faction ${metric}`);
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
  for (const [metric, value] of Object.entries(metrics)) {
    assertPercentage(value, `${field} ${metric}`);
  }
}

export function assertValidMinimalContent(content: MinimalContent): void {
  const { archetype, rival } = content;

  if (archetype.role !== "player") {
    throw new Error("Minimal archetype project role must be player");
  }
  if (rival.project.role !== "rival") {
    throw new Error("Minimal rival project role must be rival");
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

  assertId(rival.project.id, "project");
  assertId(rival.project.decisionPolicyId, "rival-policy");
  if (rival.project.originArchetypeId !== archetype.archetype.id) {
    throw new Error("Minimal rival must reference the available archetype");
  }
  assertIdeology(rival.project.ideology, "Minimal rival");
  const rivalInstitutionIds = assertInstitutions(rival.project.institutions, "Minimal rival");
  assertFactions(rival.project.factions, rivalInstitutionIds, "Minimal rival");
  assertMetrics(rival.project.metrics, "Minimal rival metric");
}
