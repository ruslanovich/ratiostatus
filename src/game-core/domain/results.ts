import type { AIAction, PlayerAction } from "./actions";
import type { EventCard } from "./events";
import type {
  DomainReference,
  EndingDefinitionId,
  EndingId,
  SignedPercentage,
  StateFieldId,
  TurnNumber,
  TurnResultId,
} from "./primitives";

export type EndingCategory = "success" | "transformation" | "failure";

export interface Ending {
  readonly id: EndingId;
  readonly definitionId: EndingDefinitionId;
  readonly category: EndingCategory;
  readonly causes: readonly DomainReference[];
}

export interface StateChange {
  readonly target: DomainReference;
  readonly field: StateFieldId;
  /** Values use the inclusive -100..100 domain envelope; narrower field bounds remain applicable. */
  readonly before: SignedPercentage;
  /** Values use the inclusive -100..100 domain envelope; narrower field bounds remain applicable. */
  readonly after: SignedPercentage;
  readonly causes: readonly DomainReference[];
}

export interface TurnResult {
  readonly id: TurnResultId;
  readonly turn: TurnNumber;
  readonly acceptedPlayerAction: PlayerAction;
  readonly aiActions: readonly AIAction[];
  readonly changes: readonly StateChange[];
  readonly events: readonly EventCard[];
  readonly ending: Ending | null;
}
