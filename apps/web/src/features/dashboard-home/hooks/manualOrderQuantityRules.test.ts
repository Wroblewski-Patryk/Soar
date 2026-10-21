import { describe, expect, it } from "vitest";
import type { DashboardManualOrderContext } from "@/features/bots/types/bot.type";
import { floorManualQuantity, getManualOrderQuantityRules, isExecutableManualQuantity } from "./manualOrderQuantityRules";

type Constraints = DashboardManualOrderContext["quantityConstraints"];
const constraints = (overrides: Partial<Constraints> = {}): Constraints => ({
  minAmount: 1, minNotional: 5, amountPrecision: 1,
  amountPrecisionMode: "TICK_SIZE", amountStep: 1,
  contractSize: 10, minExecutableQty: 60, ...overrides,
});

describe("manual-order quantity rules from API context", () => {
  it("distinguishes an integer tick from one decimal place at quantity 60.5", () => {
    const integer = getManualOrderQuantityRules(constraints());
    const decimal = getManualOrderQuantityRules(constraints({
      amountPrecisionMode: "DECIMAL_PLACES", amountStep: 0.1,
    }));
    expect(integer).not.toBeNull();
    expect(decimal).not.toBeNull();
    expect(isExecutableManualQuantity(60.5, integer!)).toBe(false);
    expect(floorManualQuantity(60.5, integer!)).toBe(60);
    expect(isExecutableManualQuantity(60.5, decimal!)).toBe(true);
    expect(floorManualQuantity(60.5, decimal!)).toBe(60.5);
  });

  it("floors to tick five and does not infer a step from the minimum", () => {
    const rules = getManualOrderQuantityRules(constraints({
      amountPrecision: 5, amountStep: 5,
    }));
    expect(rules?.step).toBe(5);
    expect(isExecutableManualQuantity(60.5, rules!)).toBe(false);
    expect(floorManualQuantity(64.99, rules!)).toBe(60);
    expect(isExecutableManualQuantity(65, rules!)).toBe(true);
  });

  it("fails closed for unknown or contradictory metadata and handles SPOT unit size", () => {
    expect(getManualOrderQuantityRules(constraints({ amountPrecisionMode: null }))).toBeNull();
    expect(getManualOrderQuantityRules(constraints({ amountStep: null }))).toBeNull();
    expect(getManualOrderQuantityRules(constraints({ amountStep: 0.1 }))).toBeNull();
    expect(getManualOrderQuantityRules(constraints({ minExecutableQty: null }))).toBeNull();
    expect(getManualOrderQuantityRules(constraints({ contractSize: null }))?.contractSize).toBe(1);
  });
});
