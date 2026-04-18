import { describe, expect, it } from "vitest";
import {
  buildDefaultColumnVisibility,
  mergeColumnVisibilityState,
  normalizeColumnVisibilityState,
} from "./useDataTableColumnVisibilityState";

describe("useDataTableColumnVisibilityState helpers", () => {
  it("normalizes only known boolean column keys", () => {
    const normalized = normalizeColumnVisibilityState(
      {
        symbol: true,
        pnl: false,
        unknown: true,
        broken: "yes",
      },
      ["symbol", "pnl", "side"]
    );

    expect(normalized).toEqual({
      symbol: true,
      pnl: false,
    });
  });

  it("merges incoming state onto visible-by-default schema", () => {
    const defaults = buildDefaultColumnVisibility(["symbol", "pnl", "side"]);
    const merged = mergeColumnVisibilityState(defaults, {
      pnl: false,
      side: true,
      foreign: false,
    } as any);

    expect(merged).toEqual({
      symbol: true,
      pnl: false,
      side: true,
    });
  });
});
