import type {
  DomainReference,
  EventDefinitionId,
  EventId,
  Percentage,
} from "./primitives";
import type { ActionKind } from "./actions";

export type EventCategory = "crisis" | "opportunity" | "interpretation";

export interface EventCard {
  readonly id: EventId;
  readonly definitionId: EventDefinitionId;
  readonly category: EventCategory;
  /** Inclusive range 0..100; validated at runtime beginning in Task 2.2. */
  readonly severity: Percentage;
  readonly causes: readonly DomainReference[];
  readonly allowedResponseKinds: readonly ActionKind[];
}
