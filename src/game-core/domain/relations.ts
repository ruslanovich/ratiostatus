import type {
  ContradictionId,
  DomainReference,
  Percentage,
  ProjectId,
  RelationId,
} from "./primitives";

export interface Contradiction {
  readonly id: ContradictionId;
  /** Inclusive range 0..100; validated at runtime beginning in Task 2.2. */
  readonly pressure: Percentage;
  readonly sources: readonly DomainReference[];
}

export type RelationMetricName = "trust" | "hostility" | "influence" | "pressure";

/** A directional relationship from one project to another. */
export interface ExternalRelation {
  readonly id: RelationId;
  readonly sourceProjectId: ProjectId;
  readonly targetProjectId: ProjectId;
  /** Every metric is in the inclusive range 0..100; runtime validation begins in Task 2.2. */
  readonly metrics: Readonly<Record<RelationMetricName, Percentage>>;
}
