import { describe, expect, it } from "vitest";
import type { DashboardManualOrderContext } from "@/features/bots/types/bot.type";
import { floorManualQuantity, getManualOrderQuantityRules, isExecutableManualQuantity } from "./manualOrderQuantityRules";

type Constraints = DashboardManualOrderContext["quantityConstraints"];
const constraints = (overrides: Partial<Constraints> = {}): Constraints => ({
  minAmount: 1, minNotional: 5, amountPrecision: 1,
  amountPrecisionMode: "TICK_SIZE", amountStep: 1,
  contractSize: 10, minExecutableQty: 60, ...overrides,
});
const futuresRules = (overrides: Partial<Constraints> = {}) =>
  getManualOrderQuantityRules(constraints(overrides), "FUTURES");

describe("manual-order quantity rules from API context", () => {
  it("distinguishes an integer tick from one decimal place at quantity 60.5", () => {
    const integer = futuresRules();
    const decimal = futuresRules({
      amountPrecisionMode: "DECIMAL_PLACES", amountStep: 0.1,
    });
    expect(integer).not.toBeNull();
    expect(decimal).not.toBeNull();
    expect(isExecutableManualQuantity(60.5, integer!)).toBe(false);
    expect(floorManualQuantity(60.5, integer!)).toBe(60);
    expect(isExecutableManualQuantity(60.5, decimal!)).toBe(true);
    expect(floorManualQuantity(60.5, decimal!)).toBe(60.5);
  });

  it("floors to tick five and does not infer a step from the minimum", () => {
    const rules = futuresRules({
      amountPrecision: 5, amountStep: 5,
    });
    expect(rules?.step).toBe(5);
    expect(isExecutableManualQuantity(60.5, rules!)).toBe(false);
    expect(floorManualQuantity(64.99, rules!)).toBe(60);
    expect(isExecutableManualQuantity(65, rules!)).toBe(true);
  });

  it("fails closed for unknown or contradictory metadata and handles SPOT unit size", () => {
    expect(futuresRules({ amountPrecisionMode: null })).toBeNull();
    expect(futuresRules({ amountStep: null })).toBeNull();
    expect(futuresRules({ amountStep: 0.1 })).toBeNull();
    expect(futuresRules({ minExecutableQty: null })).toBeNull();
    expect(futuresRules({ contractSize: null })).toBeNull();
    expect(futuresRules({ contractSize: 0 })).toBeNull();
    expect(futuresRules({ contractSize: -1 })).toBeNull();
    expect(futuresRules({ contractSize: Infinity })).toBeNull();
    expect(getManualOrderQuantityRules(constraints(), null)).toBeNull();
    expect(getManualOrderQuantityRules(constraints({ contractSize: null }), "SPOT")?.contractSize).toBe(1);
  });
});
