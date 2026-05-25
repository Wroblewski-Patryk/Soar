import type { RuntimeSymbolWithLive } from "./types";

export type RuntimeSignalConditionScope = "LONG" | "SHORT";

export const hasMatchedSignalCondition = (
  signal: Pick<RuntimeSymbolWithLive, "lastSignalConditionLines" | "lastSignalConditionActive">
) =>
  signal.lastSignalConditionActive != null
    ? signal.lastSignalConditionActive.long || signal.lastSignalConditionActive.short
    :
  signal.lastSignalConditionLines?.some(
    (line) => (line.scope === "LONG" || line.scope === "SHORT") && line.matched === true
  ) === true;

export const hasMatchedSignalConditionScope = (
  signal: Pick<RuntimeSymbolWithLive, "lastSignalConditionLines" | "lastSignalConditionActive">,
  scope: RuntimeSignalConditionScope
) =>
  signal.lastSignalConditionActive != null
    ? (scope === "LONG" ? signal.lastSignalConditionActive.long : signal.lastSignalConditionActive.short)
    : signal.lastSignalConditionLines?.some((line) => line.scope === scope && line.matched === true) === true;
