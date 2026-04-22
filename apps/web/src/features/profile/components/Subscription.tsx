"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useI18n } from "../../../i18n/I18nProvider";
import { getProfileSubscription } from "../services/subscription.service";
import { ProfileSubscriptionResponse, SubscriptionCatalogItem } from "../types/subscription.type";

export default function SubscriptionPanel() {
  const { locale, t } = useI18n();
  const subscriptionText = useCallback((key: string) => t(`dashboard.subscription.${key}`), [t]);

  const [data, setData] = useState<ProfileSubscriptionResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadSubscription = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const payload = await getProfileSubscription();
      setData(payload);
    } catch {
      setError(subscriptionText("loadError"));
    } finally {
      setLoading(false);
    }
  }, [subscriptionText]);

  useEffect(() => {
    void loadSubscription();
  }, [loadSubscription]);

  const activePlanCode = data?.activePlanCode ?? null;

  const sortedCatalog = useMemo(() => {
    return [...(data?.catalog ?? [])].sort((a, b) => a.sortOrder - b.sortOrder);
  }, [data?.catalog]);

  const formatPrice = (item: SubscriptionCatalogItem) => {
    if (item.priceMonthlyMinor <= 0) return subscriptionText("free");

    const amount = item.priceMonthlyMinor / 100;
    return `${new Intl.NumberFormat(locale, {
      style: "currency",
      currency: item.currency || "USD",
      maximumFractionDigits: 2,
    }).format(amount)} / ${subscriptionText("monthly")}`;
  };

  if (loading) {
    return <p className="text-sm opacity-70">{subscriptionText("loading")}</p>;
  }

  if (error) {
    return (
      <div className="space-y-3">
        <p className="text-sm text-error">{error}</p>
        <button type="button" className="btn btn-outline btn-sm" onClick={() => void loadSubscription()}>
          {subscriptionText("retry")}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold mb-4">{subscriptionText("title")}</h2>

      <div className="grid gap-3 md:grid-cols-3">
        {sortedCatalog.map((plan) => {
          const limits = plan.entitlements?.limits;
          const features = plan.entitlements?.features;
          const isActive = activePlanCode === plan.code;
          return (
            <article
              key={plan.code}
              className={`rounded-box border p-3 transition-colors ${
                isActive ? "border-success/70 bg-success/10" : "border-base-300/60 bg-base-100"
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="text-sm font-semibold">{plan.displayName}</h3>
                  <p className="text-xs opacity-70">{formatPrice(plan)}</p>
                </div>
                {isActive ? <span className="badge badge-success badge-outline badge-sm">{subscriptionText("activePlan")}</span> : null}
              </div>

              <div className="mt-3 space-y-1 text-xs">
                <p className="flex items-center justify-between gap-2">
                  <span className="opacity-70">{subscriptionText("maxBots")}</span>
                  <span className="font-medium">{limits?.maxBotsTotal ?? "-"}</span>
                </p>
                <p className="flex items-center justify-between gap-2">
                  <span className="opacity-70">{subscriptionText("maxBotsPaper")}</span>
                  <span className="font-medium">{limits?.maxBotsByMode?.PAPER ?? "-"}</span>
                </p>
                <p className="flex items-center justify-between gap-2">
                  <span className="opacity-70">{subscriptionText("maxBotsLive")}</span>
                  <span className="font-medium">{limits?.maxBotsByMode?.LIVE ?? "-"}</span>
                </p>
                <p className="flex items-center justify-between gap-2">
                  <span className="opacity-70">{subscriptionText("maxBacktests")}</span>
                  <span className="font-medium">{limits?.maxConcurrentBacktests ?? "-"}</span>
                </p>
                <p className="flex items-center justify-between gap-2">
                  <span className="opacity-70">{subscriptionText("liveTrading")}</span>
                  <span className="font-medium">{features?.liveTrading ? subscriptionText("yes") : subscriptionText("no")}</span>
                </p>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
