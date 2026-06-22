import { describe, expect, it } from "vitest";

import { createMinimalInitialGameState } from "../src/content";
import { createDoctrineShiftAction } from "../src/ui/dev-loop/createDoctrineShiftAction";

describe("bare development loop action", () => {
  it("constructs the supported player doctrine-shift intent from state", () => {
    const state = createMinimalInitialGameState();

    expect(createDoctrineShiftAction(state)).toEqual({
      id: "action:bare-development-doctrine-shift",
      actorProjectId: state.playerProject.id,
      actorRole: "player",
      kind: "shift_doctrine",
      targets: [{ kind: "project", id: state.playerProject.id }],
    });
  });
});
