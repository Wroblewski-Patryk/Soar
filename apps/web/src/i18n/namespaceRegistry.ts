import { adminEn } from "./namespaces/admin.en";
import { adminPl } from "./namespaces/admin.pl";
import { adminDeCh } from "./namespaces/admin.de-CH";
import { adminPt } from "./namespaces/admin.pt";
import { authEn } from "./namespaces/auth.en";
import { authPl } from "./namespaces/auth.pl";
import { authDeCh } from "./namespaces/auth.de-CH";
import { authPt } from "./namespaces/auth.pt";
import { dashboardBacktestsEn } from "./namespaces/dashboard-backtests.en";
import { dashboardBacktestsPl } from "./namespaces/dashboard-backtests.pl";
import { dashboardBacktestsDeCh } from "./namespaces/dashboard-backtests.de-CH";
import { dashboardBacktestsPt } from "./namespaces/dashboard-backtests.pt";
import { dashboardBotsEn } from "./namespaces/dashboard-bots.en";
import { dashboardBotsPl } from "./namespaces/dashboard-bots.pl";
import { dashboardBotsDeCh } from "./namespaces/dashboard-bots.de-CH";
import { dashboardBotsPt } from "./namespaces/dashboard-bots.pt";
import { dashboardHomeEn } from "./namespaces/dashboard-home.en";
import { dashboardHomePl } from "./namespaces/dashboard-home.pl";
import { dashboardHomeDeCh } from "./namespaces/dashboard-home.de-CH";
import { dashboardHomePt } from "./namespaces/dashboard-home.pt";
import { dashboardMarketsEn } from "./namespaces/dashboard-markets.en";
import { dashboardMarketsPl } from "./namespaces/dashboard-markets.pl";
import { dashboardMarketsDeCh } from "./namespaces/dashboard-markets.de-CH";
import { dashboardMarketsPt } from "./namespaces/dashboard-markets.pt";
import { dashboardReportsEn } from "./namespaces/dashboard-reports.en";
import { dashboardReportsPl } from "./namespaces/dashboard-reports.pl";
import { dashboardReportsDeCh } from "./namespaces/dashboard-reports.de-CH";
import { dashboardReportsPt } from "./namespaces/dashboard-reports.pt";
import { dashboardShellEn } from "./namespaces/dashboard-shell.en";
import { dashboardShellPl } from "./namespaces/dashboard-shell.pl";
import { dashboardShellDeCh } from "./namespaces/dashboard-shell.de-CH";
import { dashboardShellPt } from "./namespaces/dashboard-shell.pt";
import { dashboardStrategiesEn } from "./namespaces/dashboard-strategies.en";
import { dashboardStrategiesPl } from "./namespaces/dashboard-strategies.pl";
import { dashboardStrategiesDeCh } from "./namespaces/dashboard-strategies.de-CH";
import { dashboardStrategiesPt } from "./namespaces/dashboard-strategies.pt";
import { dashboardWalletsEn } from "./namespaces/dashboard-wallets.en";
import { dashboardWalletsPl } from "./namespaces/dashboard-wallets.pl";
import { dashboardWalletsDeCh } from "./namespaces/dashboard-wallets.de-CH";
import { dashboardWalletsPt } from "./namespaces/dashboard-wallets.pt";
import { publicEn } from "./namespaces/public.en";
import { publicPl } from "./namespaces/public.pl";
import { publicDeCh } from "./namespaces/public.de-CH";
import { publicPt } from "./namespaces/public.pt";

type Locale = "en" | "pl" | "pt" | "de-CH";
type TranslationFragment = Record<string, unknown>;

type LocaleNamespaceMap = Record<Locale, TranslationFragment>;

export const I18N_NAMESPACE_REGISTRY = {
  public: {
    en: { public: publicEn },
    pl: { public: publicPl },
    pt: { public: publicPt },
    "de-CH": { public: publicDeCh },
  },
  auth: {
    en: { auth: authEn },
    pl: { auth: authPl },
    pt: { auth: authPt },
    "de-CH": { auth: authDeCh },
  },
  admin: {
    en: { admin: adminEn },
    pl: { admin: adminPl },
    pt: { admin: adminPt },
    "de-CH": { admin: adminDeCh },
  },
  dashboardShell: {
    en: { dashboard: dashboardShellEn },
    pl: { dashboard: dashboardShellPl },
    pt: { dashboard: dashboardShellPt },
    "de-CH": { dashboard: dashboardShellDeCh },
  },
  dashboardHome: {
    en: { dashboard: { home: dashboardHomeEn } },
    pl: { dashboard: { home: dashboardHomePl } },
    pt: { dashboard: { home: dashboardHomePt } },
    "de-CH": { dashboard: { home: dashboardHomeDeCh } },
  },
  dashboardBots: {
    en: { dashboard: { bots: dashboardBotsEn } },
    pl: { dashboard: { bots: dashboardBotsPl } },
    pt: { dashboard: { bots: dashboardBotsPt } },
    "de-CH": { dashboard: { bots: dashboardBotsDeCh } },
  },
  dashboardBacktests: {
    en: { dashboard: { backtests: dashboardBacktestsEn } },
    pl: { dashboard: { backtests: dashboardBacktestsPl } },
    pt: { dashboard: { backtests: dashboardBacktestsPt } },
    "de-CH": { dashboard: { backtests: dashboardBacktestsDeCh } },
  },
  dashboardMarkets: {
    en: { dashboard: { markets: dashboardMarketsEn } },
    pl: { dashboard: { markets: dashboardMarketsPl } },
    pt: { dashboard: { markets: dashboardMarketsPt } },
    "de-CH": { dashboard: { markets: dashboardMarketsDeCh } },
  },
  dashboardStrategies: {
    en: { dashboard: { strategies: dashboardStrategiesEn } },
    pl: { dashboard: { strategies: dashboardStrategiesPl } },
    pt: { dashboard: { strategies: dashboardStrategiesPt } },
    "de-CH": { dashboard: { strategies: dashboardStrategiesDeCh } },
  },
  dashboardWallets: {
    en: { dashboard: { wallets: dashboardWalletsEn } },
    pl: { dashboard: { wallets: dashboardWalletsPl } },
    pt: { dashboard: { wallets: dashboardWalletsPt } },
    "de-CH": { dashboard: { wallets: dashboardWalletsDeCh } },
  },
  dashboardReports: {
    en: { dashboard: { reports: dashboardReportsEn } },
    pl: { dashboard: { reports: dashboardReportsPl } },
    pt: { dashboard: { reports: dashboardReportsPt } },
    "de-CH": { dashboard: { reports: dashboardReportsDeCh } },
  },
} as const satisfies Record<string, LocaleNamespaceMap>;

export type I18nNamespace = keyof typeof I18N_NAMESPACE_REGISTRY;

const isPlainObject = (value: unknown): value is Record<string, unknown> =>
  value != null && typeof value === "object" && !Array.isArray(value);

const deepMerge = (target: TranslationFragment, source: TranslationFragment): TranslationFragment => {
  const next: TranslationFragment = { ...target };

  for (const [key, value] of Object.entries(source)) {
    const targetValue = next[key];
    if (isPlainObject(targetValue) && isPlainObject(value)) {
      next[key] = deepMerge(targetValue, value);
      continue;
    }
    next[key] = value;
  }

  return next;
};

export const mergeNamespaceTranslations = (fragments: TranslationFragment[]): TranslationFragment =>
  fragments.reduce((acc, fragment) => deepMerge(acc, fragment), {} as TranslationFragment);

export const ALL_I18N_NAMESPACES = Object.keys(I18N_NAMESPACE_REGISTRY) as I18nNamespace[];

export const buildTranslationsForLocale = (locale: Locale): TranslationFragment =>
  mergeNamespaceTranslations(ALL_I18N_NAMESPACES.map((namespace) => I18N_NAMESPACE_REGISTRY[namespace][locale]));

export const DEFAULT_ROUTE_NAMESPACES: I18nNamespace[] = ["public", "dashboardShell"];

export const ROUTE_NAMESPACE_MAP: Array<{ routePrefix: string; namespaces: I18nNamespace[] }> = [
  { routePrefix: "/auth", namespaces: ["public", "auth"] },
  { routePrefix: "/admin", namespaces: ["public", "admin"] },
  { routePrefix: "/dashboard/backtests", namespaces: ["dashboardShell", "dashboardBacktests"] },
  { routePrefix: "/dashboard/markets", namespaces: ["dashboardShell", "dashboardMarkets"] },
  { routePrefix: "/dashboard/strategies", namespaces: ["dashboardShell", "dashboardStrategies"] },
  { routePrefix: "/dashboard/wallets", namespaces: ["dashboardShell", "dashboardWallets"] },
  { routePrefix: "/dashboard/reports", namespaces: ["dashboardShell", "dashboardReports"] },
  { routePrefix: "/dashboard/profile", namespaces: ["dashboardShell", "auth"] },
  { routePrefix: "/dashboard/bots", namespaces: ["dashboardShell", "dashboardBots"] },
  { routePrefix: "/dashboard", namespaces: ["dashboardShell", "dashboardHome", "dashboardBots"] },
  { routePrefix: "/", namespaces: ["public"] },
];

export const resolveNamespacesForRoute = (routePath: string): I18nNamespace[] => {
  const normalizedPath = routePath.trim() || "/";
  const matched = ROUTE_NAMESPACE_MAP.find(({ routePrefix }) =>
    normalizedPath === routePrefix || normalizedPath.startsWith(`${routePrefix}/`)
  );

  if (!matched) {
    return [...DEFAULT_ROUTE_NAMESPACES];
  }

  return Array.from(new Set([...DEFAULT_ROUTE_NAMESPACES, ...matched.namespaces]));
};

const routeTranslationCache = new Map<string, TranslationFragment>();

export const buildTranslationsForRoute = (locale: Locale, routePath: string): TranslationFragment => {
  const namespaces = resolveNamespacesForRoute(routePath);
  const cacheKey = `${locale}|${namespaces.join(",")}`;
  const cached = routeTranslationCache.get(cacheKey);
  if (cached) return cached;

  const merged = mergeNamespaceTranslations(
    namespaces.map((namespace) => I18N_NAMESPACE_REGISTRY[namespace][locale])
  );
  routeTranslationCache.set(cacheKey, merged);
  return merged;
};

export const clearRouteTranslationCache = () => {
  routeTranslationCache.clear();
};
