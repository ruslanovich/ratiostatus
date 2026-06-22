import type { ArchetypeId } from "../../game-core/domain";
import { provisionalArchetype } from "./provisionalArchetype";
import type { MinimalArchetypeContent } from "./types";

export const directiveSynthesisArchetype = {
  projectId: "project:directive-synthesis",
  role: "player",
  archetype: {
    id: "archetype:directive-synthesis",
    initialIdeology: {
      axes: [
        { id: "ideology-axis:coordination", position: 65 },
        { id: "ideology-axis:openness", position: -35 },
      ],
      doctrineCommitments: ["doctrine:integrated-direction"],
    },
    initialInstitutionIds: ["institution:coordination-directorate"],
    initialFactionIds: ["faction:planning-concord"],
    constraintReferences: [],
  },
  institutions: [
    {
      id: "institution:coordination-directorate",
      category: "governance",
      strength: 72,
      ruleReferences: [],
    },
  ],
  factions: [
    {
      id: "faction:planning-concord",
      interests: ["interest:coherent-execution"],
      metrics: {
        power: 68,
        support: 48,
        loyalty: 72,
        visibility: 58,
        radicalization: 12,
      },
      institutionIds: ["institution:coordination-directorate"],
    },
  ],
  metrics: {
    legitimacy: 44,
    productivity: 61,
    innovation: 42,
    mobilization: 76,
  },
} as const satisfies MinimalArchetypeContent;

export const adaptiveForumArchetype = {
  projectId: "project:adaptive-forum",
  role: "player",
  archetype: {
    id: "archetype:adaptive-forum",
    initialIdeology: {
      axes: [
        { id: "ideology-axis:openness", position: 70 },
        { id: "ideology-axis:pluralism", position: 62 },
      ],
      doctrineCommitments: ["doctrine:iterative-consensus"],
    },
    initialInstitutionIds: ["institution:distributed-inquiry-network"],
    initialFactionIds: ["faction:civic-experimenters"],
    constraintReferences: [],
  },
  institutions: [
    {
      id: "institution:distributed-inquiry-network",
      category: "cultural",
      strength: 46,
      ruleReferences: [],
    },
  ],
  factions: [
    {
      id: "faction:civic-experimenters",
      interests: ["interest:open-experimentation"],
      metrics: {
        power: 42,
        support: 63,
        loyalty: 47,
        visibility: 70,
        radicalization: 18,
      },
      institutionIds: ["institution:distributed-inquiry-network"],
    },
  ],
  metrics: {
    legitimacy: 56,
    productivity: 49,
    innovation: 79,
    mobilization: 34,
  },
} as const satisfies MinimalArchetypeContent;

export const continuityOrderArchetype = {
  projectId: "project:continuity-order",
  role: "player",
  archetype: {
    id: "archetype:continuity-order",
    initialIdeology: {
      axes: [
        { id: "ideology-axis:continuity", position: 78 },
        { id: "ideology-axis:openness", position: -22 },
      ],
      doctrineCommitments: ["doctrine:stewarded-continuity"],
    },
    initialInstitutionIds: ["institution:stewardship-chamber"],
    initialFactionIds: ["faction:stewardship-circle"],
    constraintReferences: [],
  },
  institutions: [
    {
      id: "institution:stewardship-chamber",
      category: "social",
      strength: 75,
      ruleReferences: [],
    },
  ],
  factions: [
    {
      id: "faction:stewardship-circle",
      interests: ["interest:durable-stewardship"],
      metrics: {
        power: 61,
        support: 66,
        loyalty: 78,
        visibility: 43,
        radicalization: 6,
      },
      institutionIds: ["institution:stewardship-chamber"],
    },
  ],
  metrics: {
    legitimacy: 74,
    productivity: 52,
    innovation: 31,
    mobilization: 55,
  },
} as const satisfies MinimalArchetypeContent;

export const productiveCompactArchetype = {
  projectId: "project:productive-compact",
  role: "player",
  archetype: {
    id: "archetype:productive-compact",
    initialIdeology: {
      axes: [
        { id: "ideology-axis:coordination", position: 38 },
        { id: "ideology-axis:pluralism", position: 12 },
      ],
      doctrineCommitments: ["doctrine:reciprocal-production"],
    },
    initialInstitutionIds: ["institution:infrastructure-guild"],
    initialFactionIds: ["faction:productive-league"],
    constraintReferences: [],
  },
  institutions: [
    {
      id: "institution:infrastructure-guild",
      category: "economic",
      strength: 67,
      ruleReferences: [],
    },
  ],
  factions: [
    {
      id: "faction:productive-league",
      interests: ["interest:shared-capacity"],
      metrics: {
        power: 59,
        support: 57,
        loyalty: 60,
        visibility: 52,
        radicalization: 9,
      },
      institutionIds: ["institution:infrastructure-guild"],
    },
  ],
  metrics: {
    legitimacy: 57,
    productivity: 82,
    innovation: 54,
    mobilization: 47,
  },
} as const satisfies MinimalArchetypeContent;

export const minimalArchetypes = [
  provisionalArchetype,
  directiveSynthesisArchetype,
  adaptiveForumArchetype,
  continuityOrderArchetype,
  productiveCompactArchetype,
] as const satisfies readonly MinimalArchetypeContent[];

export function getMinimalArchetypeById(
  archetypeId: ArchetypeId,
): MinimalArchetypeContent | undefined {
  return minimalArchetypes.find(({ archetype }) => archetype.id === archetypeId);
}
