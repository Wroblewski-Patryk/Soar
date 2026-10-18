import type { AdditionalState } from "../types/StrategyForm.type";

export const hasInvalidUsdtDcaConfig = (additional: AdditionalState) => {
  if (!additional.dcaEnabled || additional.dcaSizingBasis !== "usdt_contribution_v1") return false;
  if (additional.dcaMode !== "basic" && additional.dcaMode !== "advanced") return true;
  const levels = additional.dcaMode === "basic" && additional.dcaLevels.length > 0
    ? [additional.dcaLevels[0]]
    : additional.dcaLevels;
  if (levels.length === 0 || (additional.dcaMode === "basic" &&
    (!Number.isInteger(additional.dcaTimes) || additional.dcaTimes < 1 || additional.dcaTimes > 10))) return true;
  return levels.some((level) => !Number.isFinite(level.percent) || level.percent === 0 ||
    !Number.isFinite(level.multiplier) || level.multiplier <= 0 || level.multiplier > 10);
};
