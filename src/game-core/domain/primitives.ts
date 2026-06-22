/** A stable identifier scoped by a domain namespace and validated at runtime at core boundaries. */
export type StableId<Namespace extends string> = `${Namespace}:${string}`;

export type GameId = StableId<"game">;
export type ProjectId = StableId<"project">;
export type ArchetypeId = StableId<"archetype">;
export type IdeologyAxisId = StableId<"ideology-axis">;
export type DoctrineId = StableId<"doctrine">;
export type InstitutionId = StableId<"institution">;
export type FactionId = StableId<"faction">;
export type InterestId = StableId<"interest">;
export type ContradictionId = StableId<"contradiction">;
export type RelationId = StableId<"relation">;
export type ActionId = StableId<"action">;
export type EventId = StableId<"event">;
export type EventDefinitionId = StableId<"event-definition">;
export type EndingId = StableId<"ending">;
export type EndingDefinitionId = StableId<"ending-definition">;
export type TurnResultId = StableId<"turn-result">;
export type RuleReferenceId = StableId<"rule">;
export type RivalPolicyId = StableId<"rival-policy">;
export type StateFieldId = StableId<"state-field">;

/** Integer turn boundary in the inclusive range 0..12. */
export type TurnNumber = number;

/** Configured session length in the inclusive range 10..12. */
export type TurnLimit = number;

/** Numeric percentage in the inclusive range 0..100. */
export type Percentage = number;

/** Signed position in the inclusive range -100..100. */
export type SignedPercentage = number;

export type ProjectRole = "player" | "rival";

export type CoreMetricName =
  | "legitimacy"
  | "productivity"
  | "innovation"
  | "mobilization";

export type DomainReference =
  | { readonly kind: "project"; readonly id: ProjectId }
  | { readonly kind: "institution"; readonly id: InstitutionId }
  | { readonly kind: "faction"; readonly id: FactionId }
  | { readonly kind: "contradiction"; readonly id: ContradictionId }
  | { readonly kind: "relation"; readonly id: RelationId }
  | { readonly kind: "action"; readonly id: ActionId }
  | { readonly kind: "event"; readonly id: EventId }
  | { readonly kind: "rule"; readonly id: RuleReferenceId };
