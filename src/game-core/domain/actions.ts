import type { ActionId, DomainReference, Percentage, ProjectId } from "./primitives";

export type ActionKind =
  | "shift_doctrine"
  | "build_institution"
  | "reinterpret_crisis"
  | "define_enemy"
  | "make_compromise"
  | "suppress_faction"
  | "empower_faction"
  | "export_ideology"
  | "seek_detente";

interface StructuredAction {
  readonly id: ActionId;
  readonly actorProjectId: ProjectId;
  readonly kind: ActionKind;
  readonly targets: readonly DomainReference[];
  /** Optional intended intensity in the inclusive range 0..100; this never encodes consequences. */
  readonly intensity?: Percentage;
}

export interface PlayerAction extends StructuredAction {
  readonly actorRole: "player";
}

export interface AIAction extends StructuredAction {
  readonly actorRole: "rival";
}

export type CoreAction = PlayerAction | AIAction;
