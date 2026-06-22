import { describe, expect, it } from "vitest";

import { findBoundaryViolations } from "../scripts/check-import-boundaries.mjs";

describe("game-core import boundaries", () => {
  it("allows imports within game-core", () => {
    const source = 'import type { GameState } from "../domain/index";';

    expect(
      findBoundaryViolations("src/game-core/simulation/resolve.ts", source),
    ).toEqual([]);
  });

  it.each([
    ['import React from "react";', "react"],
    ['import router from "next/router";', "next/router"],
    ['import OpenAI from "openai";', "openai"],
    ['import axios from "axios";', "axios"],
    ['export { fixture } from "../../content/minimal/fixture";', "../../content/minimal/fixture"],
    ['const view = await import("@/ui/dev-loop/view");', "@/ui/dev-loop/view"],
    ['const page = require("src/app/page");', "src/app/page"],
    ['import React = require("react");', "react"],
    ['import { request } from "node:https";', "node:https"],
    ['import fs from "node:fs";', "node:fs"],
  ])("rejects forbidden dependency %s", (source, specifier) => {
    const violations = findBoundaryViolations(
      "src/game-core/simulation/resolve.ts",
      source,
    );

    expect(violations).toHaveLength(1);
    expect(violations[0].message).toContain(JSON.stringify(specifier));
  });

  it.each(["window", "document", "fetch", "localStorage"])(
    "rejects direct browser global %s",
    (globalName) => {
      const violations = findBoundaryViolations(
        "src/game-core/simulation/resolve.ts",
        `${globalName};`,
      );

      expect(violations).toHaveLength(1);
      expect(violations[0].message).toContain(JSON.stringify(globalName));
    },
  );

  it("does not reject packages whose names only begin with a forbidden name", () => {
    const source = 'import example from "airbnb";';

    expect(
      findBoundaryViolations("src/game-core/domain/example.ts", source),
    ).toEqual([]);
  });

  it("does not treat comments or string contents as dependencies", () => {
    const source = `
      // import React from "react";
      const explanation = "window and fetch are forbidden in executable core code";
    `;

    expect(
      findBoundaryViolations("src/game-core/domain/example.ts", source),
    ).toEqual([]);
  });
});
