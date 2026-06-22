import type { ProvisionalArchetypeContent } from "./types";

export const provisionalArchetype = {
  projectId: "project:provisional-civic-compact",
  role: "player",
  archetype: {
    id: "archetype:provisional-civic-compact",
    initialIdeology: {
      axes: [{ id: "ideology-axis:coordination", position: 10 }],
      doctrineCommitments: ["doctrine:provisional-mutual-mandate"],
    },
    initialInstitutionIds: ["institution:deliberative-assembly"],
    initialFactionIds: ["faction:public-forum"],
    constraintReferences: [],
  },
  institutions: [
    {
      id: "institution:deliberative-assembly",
      category: "governance",
      strength: 50,
      ruleReferences: [],
    },
  ],
  factions: [
    {
      id: "faction:public-forum",
      interests: ["interest:shared-deliberation"],
      metrics: {
        power: 50,
        support: 50,
        loyalty: 50,
        visibility: 50,
        radicalization: 0,
      },
      institutionIds: ["institution:deliberative-assembly"],
    },
  ],
  metrics: {
    legitimacy: 50,
    productivity: 50,
    innovation: 50,
    mobilization: 50,
  },
} as const satisfies ProvisionalArchetypeContent;
