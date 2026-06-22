import type { Faction } from "./factions";
import type { IdeologyProfile } from "./ideology";
import type { Institution } from "./institutions";
import type { Contradiction, ExternalRelation } from "./relations";
import type { Ending } from "./results";
import type {
  ArchetypeId,
  CoreMetricName,
  EventId,
  FactionId,
  GameId,
  InstitutionId,
  Percentage,
  ProjectId,
  ProjectRole,
  RivalPolicyId,
  RuleReferenceId,
  TurnLimit,
  TurnNumber,
  TurnResultId,
} from "./primitives";

export interface Archetype {
  readonly id: ArchetypeId;
  readonly initialIdeology: IdeologyProfile;
  readonly initialInstitutionIds: readonly InstitutionId[];
  readonly initialFactionIds: readonly FactionId[];
  readonly constraintReferences: readonly RuleReferenceId[];
}

export interface CivilizationalProject {
  readonly id: ProjectId;
  readonly role: ProjectRole;
  readonly originArchetypeId: ArchetypeId;
  readonly ideology: IdeologyProfile;
  readonly institutions: readonly Institution[];
  readonly factions: readonly Faction[];
  readonly contradictions: readonly Contradiction[];
  readonly relations: readonly ExternalRelation[];
  /** Every metric is in the inclusive range 0..100; validated at runtime at core boundaries. */
  readonly metrics: Readonly<Record<CoreMetricName, Percentage>>;
}

export interface RivalProject extends CivilizationalProject {
  readonly role: "rival";
  /** Identifies a future deterministic policy; this skeleton does not implement that policy. */
  readonly decisionPolicyId: RivalPolicyId;
}

export interface GameState {
  readonly id: GameId;
  readonly turn: TurnNumber;
  readonly turnLimit: TurnLimit;
  readonly playerProject: CivilizationalProject & { readonly role: "player" };
  readonly rivalProjects: readonly RivalProject[];
  readonly activeEventIds: readonly EventId[];
  readonly history: readonly TurnResultId[];
  readonly ending: Ending | null;
}
