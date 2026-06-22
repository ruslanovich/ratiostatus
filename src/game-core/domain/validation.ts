import type { CoreAction, PlayerAction } from "./actions";
import type { EventCard } from "./events";
import type { Faction } from "./factions";
import type { IdeologyProfile } from "./ideology";
import type { Institution } from "./institutions";
import type {
  DomainReference,
  Percentage,
  SignedPercentage,
  TurnLimit,
  TurnNumber,
} from "./primitives";
import type { Contradiction, ExternalRelation } from "./relations";
import type { Ending, TurnResult } from "./results";
import type { CivilizationalProject, GameState, RivalProject } from "./state";

const ACTION_KINDS = new Set([
  "shift_doctrine",
  "build_institution",
  "reinterpret_crisis",
  "define_enemy",
  "make_compromise",
  "suppress_faction",
  "empower_faction",
  "export_ideology",
  "seek_detente",
]);

const INSTITUTION_CATEGORIES = new Set([
  "governance",
  "economic",
  "social",
  "security",
  "cultural",
]);

const EVENT_CATEGORIES = new Set(["crisis", "opportunity", "interpretation"]);
const ENDING_CATEGORIES = new Set(["success", "transformation", "failure"]);
const PROJECT_ROLES = new Set(["player", "rival"]);

const REFERENCE_NAMESPACES: Readonly<Record<string, string>> = {
  project: "project",
  institution: "institution",
  faction: "faction",
  contradiction: "contradiction",
  relation: "relation",
  action: "action",
  event: "event",
  rule: "rule",
};

function assertArray(value: unknown, field: string): asserts value is readonly unknown[] {
  if (!Array.isArray(value)) {
    throw new Error(`${field} must be an array`);
  }
}

function assertAllowed(value: string, allowed: ReadonlySet<string>, field: string): void {
  if (!allowed.has(value)) {
    throw new Error(`${field} has invalid value ${value}`);
  }
}

function assertPercentageRecord(
  value: Record<string, Percentage>,
  fields: readonly string[],
  field: string,
): void {
  for (const name of fields) {
    assertPercentage(value[name], `${field}.${name}`);
  }
}

export function assertPercentage(
  value: number,
  field: string,
): asserts value is Percentage {
  if (!Number.isFinite(value) || value < 0 || value > 100) {
    throw new Error(`${field} must be a finite number within 0..100`);
  }
}

export function assertSignedPercentage(
  value: number,
  field: string,
): asserts value is SignedPercentage {
  if (!Number.isFinite(value) || value < -100 || value > 100) {
    throw new Error(`${field} must be a finite number within -100..100`);
  }
}

export function assertTurnNumber(
  value: number,
  field: string,
): asserts value is TurnNumber {
  if (!Number.isFinite(value) || !Number.isInteger(value) || value < 0 || value > 12) {
    throw new Error(`${field} must be a finite integer within 0..12`);
  }
}

export function assertTurnLimit(
  value: number,
  field: string,
): asserts value is TurnLimit {
  if (!Number.isFinite(value) || !Number.isInteger(value) || value < 10 || value > 12) {
    throw new Error(`${field} must be a finite integer within 10..12`);
  }
}

export function assertStableId(value: string, namespace: string, field: string): void {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(namespace)) {
    throw new Error(`Invalid stable ID namespace ${namespace}`);
  }
  const pattern = new RegExp(`^${namespace}:[a-z0-9]+(?:-[a-z0-9]+)*$`);

  if (typeof value !== "string" || !pattern.test(value)) {
    throw new Error(`${field} must be a stable ${namespace}:lowercase-kebab-case ID`);
  }
}

function assertDomainReference(reference: DomainReference, field: string): void {
  const namespace = REFERENCE_NAMESPACES[reference.kind];

  if (namespace === undefined) {
    throw new Error(`${field}.kind has invalid value ${String(reference.kind)}`);
  }

  assertStableId(reference.id, namespace, `${field}.id`);
}

function assertIdeology(profile: IdeologyProfile, field: string): void {
  assertArray(profile.axes, `${field}.axes`);
  if (profile.axes.length === 0) {
    throw new Error(`${field}.axes must contain at least one ideology axis`);
  }

  for (const [index, axis] of profile.axes.entries()) {
    assertStableId(axis.id, "ideology-axis", `${field}.axes[${index}].id`);
    assertSignedPercentage(axis.position, `${field}.axes[${index}].position`);
  }

  assertArray(profile.doctrineCommitments, `${field}.doctrineCommitments`);
  for (const [index, doctrineId] of profile.doctrineCommitments.entries()) {
    assertStableId(doctrineId, "doctrine", `${field}.doctrineCommitments[${index}]`);
  }
}

function assertInstitution(institution: Institution, field: string): void {
  assertStableId(institution.id, "institution", `${field}.id`);
  assertAllowed(institution.category, INSTITUTION_CATEGORIES, `${field}.category`);
  assertPercentage(institution.strength, `${field}.strength`);
  assertArray(institution.ruleReferences, `${field}.ruleReferences`);
  for (const [index, ruleId] of institution.ruleReferences.entries()) {
    assertStableId(ruleId, "rule", `${field}.ruleReferences[${index}]`);
  }
}

function assertFaction(
  faction: Faction,
  institutionIds: ReadonlySet<string>,
  field: string,
): void {
  assertStableId(faction.id, "faction", `${field}.id`);
  assertArray(faction.interests, `${field}.interests`);
  for (const [index, interestId] of faction.interests.entries()) {
    assertStableId(interestId, "interest", `${field}.interests[${index}]`);
  }
  assertPercentageRecord(
    faction.metrics,
    ["power", "support", "loyalty", "visibility", "radicalization"],
    `${field}.metrics`,
  );
  assertArray(faction.institutionIds, `${field}.institutionIds`);
  for (const [index, institutionId] of faction.institutionIds.entries()) {
    assertStableId(institutionId, "institution", `${field}.institutionIds[${index}]`);
    if (!institutionIds.has(institutionId)) {
      throw new Error(`${field}.institutionIds references missing local institution ${institutionId}`);
    }
  }
}

function assertContradiction(contradiction: Contradiction, field: string): void {
  assertStableId(contradiction.id, "contradiction", `${field}.id`);
  assertPercentage(contradiction.pressure, `${field}.pressure`);
  assertArray(contradiction.sources, `${field}.sources`);
  for (const [index, source] of contradiction.sources.entries()) {
    assertDomainReference(source, `${field}.sources[${index}]`);
  }
}

function assertRelation(relation: ExternalRelation, field: string): void {
  assertStableId(relation.id, "relation", `${field}.id`);
  assertStableId(relation.sourceProjectId, "project", `${field}.sourceProjectId`);
  assertStableId(relation.targetProjectId, "project", `${field}.targetProjectId`);
  assertPercentageRecord(
    relation.metrics,
    ["trust", "hostility", "influence", "pressure"],
    `${field}.metrics`,
  );
}

export function assertValidCivilizationalProject(
  project: CivilizationalProject,
  field = "project",
): void {
  assertStableId(project.id, "project", `${field}.id`);
  assertAllowed(project.role, PROJECT_ROLES, `${field}.role`);
  assertStableId(project.originArchetypeId, "archetype", `${field}.originArchetypeId`);
  assertIdeology(project.ideology, `${field}.ideology`);

  assertArray(project.institutions, `${field}.institutions`);
  const institutionIds = new Set<string>();
  for (const [index, institution] of project.institutions.entries()) {
    assertInstitution(institution, `${field}.institutions[${index}]`);
    institutionIds.add(institution.id);
  }

  assertArray(project.factions, `${field}.factions`);
  for (const [index, faction] of project.factions.entries()) {
    assertFaction(faction, institutionIds, `${field}.factions[${index}]`);
  }

  assertArray(project.contradictions, `${field}.contradictions`);
  for (const [index, contradiction] of project.contradictions.entries()) {
    assertContradiction(contradiction, `${field}.contradictions[${index}]`);
  }

  assertArray(project.relations, `${field}.relations`);
  for (const [index, relation] of project.relations.entries()) {
    assertRelation(relation, `${field}.relations[${index}]`);
  }

  assertPercentageRecord(
    project.metrics,
    ["legitimacy", "productivity", "innovation", "mobilization"],
    `${field}.metrics`,
  );
}

function assertValidRivalProject(project: RivalProject, field: string): void {
  assertValidCivilizationalProject(project, field);
  if (project.role !== "rival") {
    throw new Error(`${field}.role must be rival`);
  }
  assertStableId(project.decisionPolicyId, "rival-policy", `${field}.decisionPolicyId`);
}

function assertAction(action: CoreAction, expectedRole: "player" | "rival", field: string): void {
  assertStableId(action.id, "action", `${field}.id`);
  if (action.actorRole !== expectedRole) {
    throw new Error(
      expectedRole === "player"
        ? `${field} must have the player actor role`
        : `${field} must have the rival actor role`,
    );
  }
  assertStableId(action.actorProjectId, "project", `${field}.actorProjectId`);
  assertAllowed(action.kind, ACTION_KINDS, `${field}.kind`);
  assertArray(action.targets, `${field}.targets`);
  for (const [index, target] of action.targets.entries()) {
    assertDomainReference(target, `${field}.targets[${index}]`);
  }
  if (action.intensity !== undefined) {
    assertPercentage(action.intensity, `${field}.intensity`);
  }
}

export function assertValidPlayerAction(action: PlayerAction, state?: GameState): void {
  assertAction(action, "player", "action");
  if (state !== undefined && action.actorProjectId !== state.playerProject.id) {
    throw new Error("action actor must match the player project in state");
  }
}

function assertEnding(ending: Ending, field: string): void {
  assertStableId(ending.id, "ending", `${field}.id`);
  assertStableId(ending.definitionId, "ending-definition", `${field}.definitionId`);
  assertAllowed(ending.category, ENDING_CATEGORIES, `${field}.category`);
  assertArray(ending.causes, `${field}.causes`);
  for (const [index, cause] of ending.causes.entries()) {
    assertDomainReference(cause, `${field}.causes[${index}]`);
  }
}

function assertEventCard(event: EventCard, field: string): void {
  assertStableId(event.id, "event", `${field}.id`);
  assertStableId(event.definitionId, "event-definition", `${field}.definitionId`);
  assertAllowed(event.category, EVENT_CATEGORIES, `${field}.category`);
  assertPercentage(event.severity, `${field}.severity`);
  assertArray(event.causes, `${field}.causes`);
  for (const [index, cause] of event.causes.entries()) {
    assertDomainReference(cause, `${field}.causes[${index}]`);
  }
  assertArray(event.allowedResponseKinds, `${field}.allowedResponseKinds`);
  for (const [index, kind] of event.allowedResponseKinds.entries()) {
    assertAllowed(kind, ACTION_KINDS, `${field}.allowedResponseKinds[${index}]`);
  }
}

export function assertValidGameState(state: GameState): void {
  assertStableId(state.id, "game", "state.id");
  assertTurnNumber(state.turn, "state.turn");
  assertTurnLimit(state.turnLimit, "state.turnLimit");
  if (state.turn > state.turnLimit) {
    throw new Error("state.turn must not exceed state.turnLimit");
  }

  assertValidCivilizationalProject(state.playerProject, "state.playerProject");
  if (state.playerProject.role !== "player") {
    throw new Error("state.playerProject.role must be player");
  }

  assertArray(state.rivalProjects, "state.rivalProjects");
  for (const [index, rival] of state.rivalProjects.entries()) {
    assertValidRivalProject(rival, `state.rivalProjects[${index}]`);
  }

  assertArray(state.activeEventIds, "state.activeEventIds");
  for (const [index, eventId] of state.activeEventIds.entries()) {
    assertStableId(eventId, "event", `state.activeEventIds[${index}]`);
  }
  assertArray(state.history, "state.history");
  for (const [index, resultId] of state.history.entries()) {
    assertStableId(resultId, "turn-result", `state.history[${index}]`);
  }
  if (state.ending !== null) {
    assertEnding(state.ending, "state.ending");
  }
}

export function assertValidTurnResult(result: TurnResult): void {
  assertStableId(result.id, "turn-result", "result.id");
  assertTurnNumber(result.turn, "result.turn");
  assertValidPlayerAction(result.acceptedPlayerAction);

  assertArray(result.aiActions, "result.aiActions");
  for (const [index, action] of result.aiActions.entries()) {
    assertAction(action, "rival", `result.aiActions[${index}]`);
  }

  assertArray(result.changes, "result.changes");
  for (const [index, change] of result.changes.entries()) {
    const field = `result.changes[${index}]`;
    assertDomainReference(change.target, `${field}.target`);
    assertStableId(change.field, "state-field", `${field}.field`);
    assertSignedPercentage(change.before, `${field}.before`);
    assertSignedPercentage(change.after, `${field}.after`);
    assertArray(change.causes, `${field}.causes`);
    for (const [causeIndex, cause] of change.causes.entries()) {
      assertDomainReference(cause, `${field}.causes[${causeIndex}]`);
    }
  }

  assertArray(result.events, "result.events");
  for (const [index, event] of result.events.entries()) {
    assertEventCard(event, `result.events[${index}]`);
  }
  if (result.ending !== null) {
    assertEnding(result.ending, "result.ending");
  }
}
