import type {
  FactionId,
  InstitutionId,
  InterestId,
  Percentage,
} from "./primitives";

export type FactionMetricName =
  | "power"
  | "support"
  | "loyalty"
  | "visibility"
  | "radicalization";

export interface Faction {
  readonly id: FactionId;
  readonly interests: readonly InterestId[];
  /** Every metric is in the inclusive range 0..100; runtime validation begins in Task 2.2. */
  readonly metrics: Readonly<Record<FactionMetricName, Percentage>>;
  readonly institutionIds: readonly InstitutionId[];
}
