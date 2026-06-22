import type { InstitutionId, Percentage, RuleReferenceId } from "./primitives";

export type InstitutionCategory =
  | "governance"
  | "economic"
  | "social"
  | "security"
  | "cultural";

export interface Institution {
  readonly id: InstitutionId;
  readonly category: InstitutionCategory;
  /** Inclusive range 0..100; validated at runtime at core boundaries. */
  readonly strength: Percentage;
  readonly ruleReferences: readonly RuleReferenceId[];
}
