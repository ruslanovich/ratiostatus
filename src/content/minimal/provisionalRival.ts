import type { ProvisionalRivalContent } from "./types";

export const provisionalRival = {
  project: {
    id: "project:rival-obsidian-accord",
    role: "rival",
    originArchetypeId: "archetype:provisional-civic-compact",
    ideology: {
      axes: [{ id: "ideology-axis:coordination", position: -20 }],
      doctrineCommitments: ["doctrine:provisional-ordered-consensus"],
    },
    institutions: [
      {
        id: "institution:concord-council",
        category: "governance",
        strength: 55,
        ruleReferences: [],
      },
    ],
    factions: [
      {
        id: "faction:continuity-circle",
        interests: ["interest:cohesive-direction"],
        metrics: {
          power: 50,
          support: 50,
          loyalty: 50,
          visibility: 50,
          radicalization: 0,
        },
        institutionIds: ["institution:concord-council"],
      },
    ],
    contradictions: [],
    relations: [],
    metrics: {
      legitimacy: 50,
      productivity: 50,
      innovation: 50,
      mobilization: 50,
    },
    decisionPolicyId: "rival-policy:provisional-unimplemented",
  },
} as const satisfies ProvisionalRivalContent;
