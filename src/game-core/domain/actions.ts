import type { InstitutionCategory } from "./institutions";
import type {
  ActionId,
  DomainReference,
  EventId,
  FactionId,
  IdeologyAxisId,
  InstitutionId,
  Percentage,
  ProjectId,
} from "./primitives";

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

export interface ShiftDoctrineParameters {
  readonly axisId: IdeologyAxisId;
  readonly direction: "increase" | "decrease";
  readonly magnitude: Percentage;
}

export interface BuildInstitutionParameters {
  readonly institutionId: InstitutionId;
  readonly category: InstitutionCategory;
}

export interface ReinterpretCrisisParameters {
  readonly eventId: EventId;
  readonly frame: "order" | "freedom" | "equality" | "faith" | "progress" | "security";
}

export interface DefineEnemyParameters {
  readonly targetProjectId: ProjectId;
  readonly framing: "existential" | "competitive" | "corrupting" | "misguided";
}

export interface MakeCompromiseParameters {
  readonly factionId: FactionId;
  readonly concession: "symbolic" | "institutional" | "material";
}

export interface SuppressFactionParameters {
  readonly factionId: FactionId;
  readonly method: "legal" | "administrative" | "coercive";
}

export interface EmpowerFactionParameters {
  readonly factionId: FactionId;
  readonly channel: "institutional" | "symbolic" | "resource";
}

export interface ExportIdeologyParameters {
  readonly targetProjectId: ProjectId;
  readonly channel: "diplomacy" | "movement_support" | "media" | "education";
}

export interface SeekDetenteParameters {
  readonly targetProjectId: ProjectId;
  readonly basis: "trade" | "security" | "cultural_exchange" | "non_interference";
}

interface StructuredActionBase<ActorRole extends "player" | "rival"> {
  readonly id: ActionId;
  readonly actorProjectId: ProjectId;
  readonly actorRole: ActorRole;
  readonly targets: readonly DomainReference[];
}

type StructuredAction<
  ActorRole extends "player" | "rival",
  Kind extends ActionKind,
  Parameters,
> = StructuredActionBase<ActorRole> & {
  readonly kind: Kind;
  readonly parameters: Parameters;
};

type ActionCatalog<ActorRole extends "player" | "rival"> =
  | StructuredAction<ActorRole, "shift_doctrine", ShiftDoctrineParameters>
  | StructuredAction<ActorRole, "build_institution", BuildInstitutionParameters>
  | StructuredAction<ActorRole, "reinterpret_crisis", ReinterpretCrisisParameters>
  | StructuredAction<ActorRole, "define_enemy", DefineEnemyParameters>
  | StructuredAction<ActorRole, "make_compromise", MakeCompromiseParameters>
  | StructuredAction<ActorRole, "suppress_faction", SuppressFactionParameters>
  | StructuredAction<ActorRole, "empower_faction", EmpowerFactionParameters>
  | StructuredAction<ActorRole, "export_ideology", ExportIdeologyParameters>
  | StructuredAction<ActorRole, "seek_detente", SeekDetenteParameters>;

export type PlayerAction = ActionCatalog<"player">;
export type AIAction = ActionCatalog<"rival">;
export type CoreAction = PlayerAction | AIAction;
