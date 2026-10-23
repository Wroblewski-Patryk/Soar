import type { DashboardManualOrderContext } from "@/features/bots/types/bot.type";

type QuantityConstraints = DashboardManualOrderContext["quantityConstraints"];

export type ManualOrderQuantityRules = {
  step: number;
  minQuantity: number;
  contractSize: number;
};

const normalize = (value: number) => Number(value.toPrecision(15));

export const isQuantityOnGrid = (quantity: number, step: number) =>
  Number.isFinite(quantity) && quantity > 0 && Number.isFinite(step) && step > 0 &&
  Math.abs(quantity - normalize(Math.round(quantity / step) * step)) <= 1e-12;

export const getManualOrderQuantityRules = (
  constraints: QuantityConstraints | null | undefined,
  marketType: "FUTURES" | "SPOT" | null,
): ManualOrderQuantityRules | null => {
  if (!constraints || !marketType ||
      (constraints.amountPrecisionMode !== "TICK_SIZE" &&
       constraints.amountPrecisionMode !== "DECIMAL_PLACES") ||
      typeof constraints.amountStep !== "number" ||
      !Number.isFinite(constraints.amountStep) || constraints.amountStep <= 0 ||
      typeof constraints.minExecutableQty !== "number" ||
      !isQuantityOnGrid(constraints.minExecutableQty, constraints.amountStep)) return null;

  const precision = constraints.amountPrecision;
  if (typeof precision !== "number" || !Number.isFinite(precision)) return null;
  const expectedStep = constraints.amountPrecisionMode === "TICK_SIZE"
    ? precision
    : Number.isInteger(precision) && precision >= 0 ? 10 ** -precision : null;
  if (expectedStep == null || !Number.isFinite(expectedStep) || expectedStep <= 0 ||
      Math.abs(constraints.amountStep - expectedStep) > Math.max(1e-12, expectedStep * 1e-12)) return null;

  const contractSize = marketType === "SPOT" ? 1 : constraints.contractSize;
  if (typeof contractSize !== "number") return null;
  if (!Number.isFinite(contractSize) || contractSize <= 0) return null;
  return {
    step: constraints.amountStep,
    minQuantity: constraints.minExecutableQty,
    contractSize,
  };
};

export const isExecutableManualQuantity = (quantity: number, rules: ManualOrderQuantityRules) =>
  isQuantityOnGrid(quantity, rules.step) && quantity + 1e-12 >= rules.minQuantity;

export const floorManualQuantity = (quantity: number, rules: ManualOrderQuantityRules): number | null => {
  if (!Number.isFinite(quantity) || quantity < rules.minQuantity - 1e-12) return null;
  const steps = Math.floor((quantity + 1e-12) / rules.step);
  const floored = normalize(steps * rules.step);
  return isExecutableManualQuantity(floored, rules) && floored <= quantity + 1e-12 ? floored : null;
};
