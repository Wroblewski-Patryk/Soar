import type { ReactNode } from "react";
import {
  LuBot,
  LuChartCandlestick,
  LuChartLine,
  LuListChecks,
  LuPackageOpen,
  LuWallet,
} from "react-icons/lu";

export type RuntimeOnboardingStep = {
  key: string;
  icon: ReactNode;
  toneClass: string;
  title: string;
  description: string;
  cta: string;
  href: string;
};

export const DASHBOARD_RUNTIME_ONBOARDING_ROUTES = {
  wallet: "/dashboard/wallets/list",
  markets: "/dashboard/markets/list",
  strategy: "/dashboard/strategies/list",
  backtest: "/dashboard/backtests/list",
  botCreate: "/dashboard/bots/create",
  botsList: "/dashboard/bots",
} as const;

export const buildRuntimeOnboardingSteps = (
  t: (key: string) => string
): RuntimeOnboardingStep[] => [
  {
    key: "wallet",
    icon: <LuWallet className="h-4 w-4" aria-hidden />,
    toneClass: "border-warning/35 bg-warning/10 text-warning",
    title: t("dashboard.home.runtime.onboardingStepWalletTitle"),
    description: t("dashboard.home.runtime.onboardingStepWalletDescription"),
    cta: t("dashboard.home.runtime.onboardingStepWalletCta"),
    href: DASHBOARD_RUNTIME_ONBOARDING_ROUTES.wallet,
  },
  {
    key: "markets",
    icon: <LuChartCandlestick className="h-4 w-4" aria-hidden />,
    toneClass: "border-primary/35 bg-primary/10 text-primary",
    title: t("dashboard.home.runtime.onboardingStepMarketsTitle"),
    description: t("dashboard.home.runtime.onboardingStepMarketsDescription"),
    cta: t("dashboard.home.runtime.onboardingStepMarketsCta"),
    href: DASHBOARD_RUNTIME_ONBOARDING_ROUTES.markets,
  },
  {
    key: "strategy",
    icon: <LuListChecks className="h-4 w-4" aria-hidden />,
    toneClass: "border-secondary/35 bg-secondary/10 text-secondary",
    title: t("dashboard.home.runtime.onboardingStepStrategyTitle"),
    description: t("dashboard.home.runtime.onboardingStepStrategyDescription"),
    cta: t("dashboard.home.runtime.onboardingStepStrategyCta"),
    href: DASHBOARD_RUNTIME_ONBOARDING_ROUTES.strategy,
  },
  {
    key: "backtest",
    icon: <LuChartLine className="h-4 w-4" aria-hidden />,
    toneClass: "border-accent/35 bg-accent/10 text-accent",
    title: t("dashboard.home.runtime.onboardingStepBacktestTitle"),
    description: t("dashboard.home.runtime.onboardingStepBacktestDescription"),
    cta: t("dashboard.home.runtime.onboardingStepBacktestCta"),
    href: DASHBOARD_RUNTIME_ONBOARDING_ROUTES.backtest,
  },
  {
    key: "bot",
    icon: <LuBot className="h-4 w-4" aria-hidden />,
    toneClass: "border-info/35 bg-info/10 text-info",
    title: t("dashboard.home.runtime.onboardingStepBotTitle"),
    description: t("dashboard.home.runtime.onboardingStepBotDescription"),
    cta: t("dashboard.home.runtime.onboardingStepBotCta"),
    href: DASHBOARD_RUNTIME_ONBOARDING_ROUTES.botCreate,
  },
];

export const extendWithRuntimeActivationStep = (
  steps: RuntimeOnboardingStep[],
  t: (key: string) => string
): RuntimeOnboardingStep[] => [
  ...steps,
  {
    key: "activate",
    icon: <LuPackageOpen className="h-4 w-4" aria-hidden />,
    toneClass: "border-success/35 bg-success/10 text-success",
    title: t("dashboard.home.runtime.onboardingStepActivateTitle"),
    description: t("dashboard.home.runtime.onboardingStepActivateDescription"),
    cta: t("dashboard.home.runtime.onboardingStepActivateCta"),
    href: DASHBOARD_RUNTIME_ONBOARDING_ROUTES.botsList,
  },
];
