import { describe, expect, it } from "vitest";
import {
  buildRuntimeOnboardingSteps,
  DASHBOARD_RUNTIME_ONBOARDING_ROUTES,
  extendWithRuntimeActivationStep,
} from "./runtimeOnboardingConfig";

describe("runtimeOnboardingConfig", () => {
  const t = (key: string) => key;

  it("builds deterministic dashboard onboarding route contract", () => {
    const steps = buildRuntimeOnboardingSteps(t);

    expect(steps.map((step) => step.key)).toEqual([
      "wallet",
      "markets",
      "strategy",
      "backtest",
      "bot",
    ]);
    expect(steps.map((step) => step.href)).toEqual([
      DASHBOARD_RUNTIME_ONBOARDING_ROUTES.wallet,
      DASHBOARD_RUNTIME_ONBOARDING_ROUTES.markets,
      DASHBOARD_RUNTIME_ONBOARDING_ROUTES.strategy,
      DASHBOARD_RUNTIME_ONBOARDING_ROUTES.backtest,
      DASHBOARD_RUNTIME_ONBOARDING_ROUTES.botCreate,
    ]);
  });

  it("extends onboarding with explicit activation step as the last entry", () => {
    const baseSteps = buildRuntimeOnboardingSteps(t);
    const extended = extendWithRuntimeActivationStep(baseSteps, t);

    expect(extended).toHaveLength(baseSteps.length + 1);
    expect(extended[extended.length - 1]).toEqual(
      expect.objectContaining({
        key: "activate",
        href: DASHBOARD_RUNTIME_ONBOARDING_ROUTES.botsList,
      })
    );
  });
});
