import type {
  DoctrineId,
  IdeologyAxisId,
  SignedPercentage,
} from "./primitives";

export interface IdeologyAxis {
  readonly id: IdeologyAxisId;
  /** Inclusive range -100..100; validated at runtime beginning in Task 2.2. */
  readonly position: SignedPercentage;
}

export interface IdeologyProfile {
  readonly axes: readonly IdeologyAxis[];
  readonly doctrineCommitments: readonly DoctrineId[];
}
