"use client";

import { isAxiosError } from "axios";
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { useI18n } from "@/i18n/I18nProvider";
import { listBots, getBotRuntimeGraph } from "@/features/bots/services/bots.service";
import type { Bot, BotRuntimeGraph } from "@/features/bots/types/bot.type";
import { getProfileSubscription } from "@/features/profile/services/subscription.service";
import type { ProfileSubscriptionResponse } from "@/features/profile/types/subscription.type";
import { listMarketUniverses } from "@/features/markets/services/markets.service";
import type { MarketUniverse } from "@/features/markets/types/marketUniverse.type";
import { activeGrantSymbols, decimalUnits, getGrantStatus, subscriptionAllowsGrant } from "./grantStatus";
import ReadBotStatusGrants from "./ReadBotStatusGrants";
import {
  createExternalClientGrant, listExternalClientGrants, revokeExternalClientGrant,
  type ExternalClientGrant,
} from "./grants.api";

type Context = {
  bots: Bot[] | null;
  graphs: Record<string, BotRuntimeGraph | null>;
  subscription: ProfileSubscriptionResponse | null;
  universes: MarketUniverse[] | null;
};

const amountPattern = /^(?:0|[1-9]\d{0,11})(?:\.\d{1,8})?$/;

export default function ExternalClientGrantsPanel() {
  const { t, locale, timeZone } = useI18n();
  const copy = useCallback((key: string) => t(`dashboard.externalGrants.${key}`), [t]);
  const [grants, setGrants] = useState<ExternalClientGrant[]>([]);
  const [context, setContext] = useState<Context>({ bots: null, graphs: {}, subscription: null, universes: null });
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [formError, setFormError] = useState("");
  const [actionError, setActionError] = useState("");
  const [saving, setSaving] = useState(false);
  const [readExclusive, setReadExclusive] = useState(false);
  const [revokingId, setRevokingId] = useState<string | null>(null);
  const [confirmRevokeId, setConfirmRevokeId] = useState<string | null>(null);
  const [issued, setIssued] = useState<{ secret: string; grant: ExternalClientGrant } | null>(null);
  const [copied, setCopied] = useState(false);
  const [now, setNow] = useState(() => Date.now());
  const [botId, setBotId] = useState("");
  const [symbol, setSymbol] = useState("");
  const [clientLabel, setClientLabel] = useState("");
  const [maxActionQuoteAmount, setMaxActionQuoteAmount] = useState("");
  const [maxTotalQuoteAmount, setMaxTotalQuoteAmount] = useState("");
  const [maxActions, setMaxActions] = useState("1");
  const [ttlMinutes, setTtlMinutes] = useState("60");
  const [password, setPassword] = useState("");
  const secretDialogRef = useRef<HTMLElement>(null);
  const createButtonRef = useRef<HTMLButtonElement>(null);
  const restoreFocusRef = useRef<HTMLButtonElement | null>(null);

  const closeSecret = useCallback(() => {
    setIssued(null);
    setCopied(false);
  }, []);

  useLayoutEffect(() => {
    if (!issued) {
      restoreFocusRef.current?.focus();
      restoreFocusRef.current = null;
      return;
    }

    const dialog = secretDialogRef.current;
    if (!dialog) return;
    const focusable = () => Array.from(dialog.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
    ));
    focusable()[0]?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        event.stopPropagation();
        closeSecret();
        return;
      }
      if (event.key !== "Tab") return;
      const controls = focusable();
      if (controls.length === 0) {
        event.preventDefault();
        dialog.focus();
        return;
      }
      const first = controls[0];
      const last = controls[controls.length - 1];
      const activeIndex = controls.indexOf(document.activeElement as HTMLElement);
      if (event.shiftKey && activeIndex <= 0) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (activeIndex === -1 || activeIndex === controls.length - 1)) {
        event.preventDefault();
        first.focus();
      }
    };
    const onFocusIn = (event: FocusEvent) => {
      if (!dialog.contains(event.target as Node)) focusable()[0]?.focus();
    };
    document.addEventListener("keydown", onKeyDown, true);
    document.addEventListener("focusin", onFocusIn, true);
    return () => {
      document.removeEventListener("keydown", onKeyDown, true);
      document.removeEventListener("focusin", onFocusIn, true);
    };
  }, [issued, closeSecret]);

  const load = useCallback(async () => {
    setLoading(true);
    setLoadError(false);
    try {
      const currentGrants = await listExternalClientGrants();
      const [botsResult, subscriptionResult, universesResult] = await Promise.allSettled([
        listBots(), getProfileSubscription(), listMarketUniverses(),
      ]);
      const bots = botsResult.status === "fulfilled" ? botsResult.value : null;
      const subscription = subscriptionResult.status === "fulfilled" ? subscriptionResult.value : null;
      const universes = universesResult.status === "fulfilled" ? universesResult.value : null;
      const graphIds = [...new Set([
        ...(bots ?? []).filter((bot) => bot.mode === "LIVE").map((bot) => bot.id),
        ...currentGrants.map((grant) => grant.botId),
      ])];
      const graphResults = await Promise.allSettled(graphIds.map((id) => getBotRuntimeGraph(id)));
      const graphs = Object.fromEntries(graphIds.map((id, index) => [
        id, graphResults[index].status === "fulfilled" ? graphResults[index].value : null,
      ])) as Record<string, BotRuntimeGraph | null>;
      setGrants(currentGrants);
      setContext({ bots, graphs, subscription, universes });
      setNow(Date.now());
    } catch {
      setLoadError(true);
      setContext({ bots: null, graphs: {}, subscription: null, universes: null });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void load(); }, [load]);
  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 60_000);
    return () => window.clearInterval(timer);
  }, []);

  const eligibleBots = useMemo(() => (context.bots ?? []).filter((bot) => {
    const graph = context.graphs[bot.id];
    return bot.mode === "LIVE" && bot.isActive && bot.liveOptIn && graph && context.universes &&
      activeGrantSymbols(bot, graph, context.universes).length > 0;
  }), [context.bots, context.graphs, context.universes]);
  const selectedBot = eligibleBots.find((bot) => bot.id === botId);
  const selectedGraph = botId ? context.graphs[botId] : null;
  const symbols = selectedBot && selectedGraph && context.universes
    ? activeGrantSymbols(selectedBot, selectedGraph, context.universes) : [];
  const canCreate = Boolean(context.subscription && subscriptionAllowsGrant(context.subscription) && eligibleBots.length > 0);

  const formatDate = (value: string) => {
    const timestamp = Date.parse(value);
    return Number.isFinite(timestamp)
      ? new Intl.DateTimeFormat(locale, { dateStyle: "medium", timeStyle: "short", timeZone }).format(timestamp)
      : value;
  };

  const errorForCreate = (error: unknown) => {
    const message = isAxiosError(error) ? error.response?.data?.error?.message : null;
    if (message === "Invalid password") return copy("passwordError");
    if (message === "Bot scope does not match grant" || message === "Bot not found") return copy("scopeError");
    if (message === "SUBSCRIPTION_ASSIGNMENT_REQUIRED" ||
        message === "live trading is not available on the active subscription plan") return copy("planError");
    if (message === "Invalid quote amount" || message === "Quote amount must be positive" ||
        message === "Total limit must cover one action") return copy("amountError");
    return copy("createError");
  };

  const handleCreate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError("");
    if (!selectedBot || !selectedGraph || !symbols.includes(symbol) || !canCreate || readExclusive) {
      setFormError(copy("scopeError"));
      return;
    }
    const count = Number(maxActions);
    const minutes = Number(ttlMinutes);
    const singleUnits = decimalUnits(maxActionQuoteAmount);
    const totalUnits = decimalUnits(maxTotalQuoteAmount);
    if (!amountPattern.test(maxActionQuoteAmount) || !amountPattern.test(maxTotalQuoteAmount) ||
        singleUnits === null || totalUnits === null || singleUnits <= BigInt(0) || totalUnits < singleUnits ||
        !Number.isInteger(count) || count < 1 || count > 1000 ||
        !Number.isInteger(minutes) || minutes < 1 || minutes > 10080 ||
        !clientLabel.trim() || !password) {
      setFormError(copy("validationError"));
      return;
    }
    setSaving(true);
    try {
      const result = await createExternalClientGrant({
        botId: selectedBot.id,
        clientLabel: clientLabel.trim(),
        exchange: selectedBot.exchange,
        marketType: selectedBot.marketType,
        symbol,
        action: "PLACE_LIVE_ORDER",
        maxActionQuoteAmount,
        maxTotalQuoteAmount,
        maxActions: count,
        ttlSeconds: minutes * 60,
        password,
      });
      setPassword("");
      setGrants((current) => [result.grant, ...current]);
      setCopied(false);
      restoreFocusRef.current = createButtonRef.current;
      setIssued({ secret: result.secret, grant: result.grant });
      setClientLabel("");
      setMaxActionQuoteAmount("");
      setMaxTotalQuoteAmount("");
    } catch (error) {
      setFormError(errorForCreate(error));
    } finally {
      setSaving(false);
    }
  };

  const handleRevoke = async (id: string) => {
    setActionError("");
    setRevokingId(id);
    try {
      const grant = await revokeExternalClientGrant(id);
      setGrants((current) => current.map((item) => item.id === id ? grant : item));
      setConfirmRevokeId(null);
    } catch {
      setActionError(copy("revokeError"));
    } finally {
      setRevokingId(null);
    }
  };

  const copySecret = async () => {
    if (!issued) return;
    try {
      await navigator.clipboard.writeText(issued.secret);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="space-y-6" data-testid="external-client-grants">
      <div className="rounded-box border border-warning/50 bg-warning/10 p-4 text-sm">
        <h2 className="font-semibold">{copy("title")}</h2>
        <p className="mt-1">{copy("boundary")}</p>
      </div>

      <ReadBotStatusGrants blocked={saving || Boolean(issued)} onExclusiveChange={setReadExclusive} />

      {issued ? (
        <section role="dialog" aria-modal="true" aria-label={copy("secretTitle")}
          ref={secretDialogRef} tabIndex={-1}
          className="rounded-box border-2 border-primary bg-base-100 p-4 sm:p-5 space-y-3" data-testid="grant-secret-panel">
          <h3 className="text-lg font-semibold">{copy("secretTitle")}</h3>
          <p className="text-sm">{copy("secretWarning")}</p>
          <p className="text-xs opacity-70">{issued.grant.clientLabel} · {issued.grant.exchange} · {issued.grant.marketType} · {issued.grant.symbol}</p>
          <code className="block rounded-box border border-base-300 bg-base-200 p-3 break-all select-all text-sm" data-testid="grant-secret">
            {issued.secret}
          </code>
          <div className="flex flex-wrap gap-2">
            <button type="button" className="btn btn-primary btn-sm" onClick={() => void copySecret()}>
              {copied ? copy("copied") : copy("copySecret")}
            </button>
            <button type="button" className="btn btn-outline btn-sm" onClick={closeSecret}>
              {copy("closeSecret")}
            </button>
          </div>
        </section>
      ) : null}

      <section className="rounded-box border border-base-300 bg-base-100 p-4 sm:p-5 space-y-4">
        <div>
          <h3 className="text-lg font-semibold">{copy("createTitle")}</h3>
          <p className="text-sm opacity-75">{copy("createDescription")}</p>
        </div>
        {loading ? <p role="status" className="text-sm">{copy("loading")}</p> : null}
        {!loading && loadError ? <p role="alert" className="text-sm text-error">{copy("loadError")}</p> : null}
        {!loading && !loadError && (!context.subscription || !context.bots || !context.universes) ?
          <p className="text-sm text-warning">{copy("contextUnavailable")}</p> : null}
        {!loading && !loadError && context.subscription && !subscriptionAllowsGrant(context.subscription) ?
          <p className="text-sm text-warning">{copy("planUnavailable")}</p> : null}
        {!loading && !loadError && context.bots && context.universes && eligibleBots.length === 0 &&
          context.bots.some((bot) => bot.mode === "LIVE" && context.graphs[bot.id] === null) ?
          <p className="text-sm text-warning">{copy("contextUnavailable")}</p> : null}
        {!loading && !loadError && context.bots && context.universes && eligibleBots.length === 0 &&
          !context.bots.some((bot) => bot.mode === "LIVE" && context.graphs[bot.id] === null) ?
          <p className="text-sm text-warning">{copy("noEligibleBots")}</p> : null}
        {!loading && !loadError ? (
          <form onSubmit={(event) => void handleCreate(event)} className="space-y-4">
            <fieldset disabled={!canCreate || saving || Boolean(issued) || readExclusive} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="form-control block text-sm font-medium">
                  <span>{copy("clientLabel")}</span>
                  <input className="input input-bordered mt-1 w-full" maxLength={100} required value={clientLabel}
                    onChange={(event) => setClientLabel(event.target.value)} autoComplete="off" />
                </label>
                <label className="form-control block text-sm font-medium">
                  <span>{copy("bot")}</span>
                  <select className="select select-bordered mt-1 w-full" required value={botId}
                    onChange={(event) => {
                      const nextId = event.target.value;
                      const bot = eligibleBots.find((item) => item.id === nextId);
                      const graph = context.graphs[nextId];
                      setBotId(nextId);
                      setSymbol(bot && graph && context.universes
                        ? activeGrantSymbols(bot, graph, context.universes)[0] ?? "" : "");
                    }}>
                    <option value="">{copy("selectBot")}</option>
                    {eligibleBots.map((bot) => <option key={bot.id} value={bot.id}>{bot.name} · {bot.exchange}/{bot.marketType}</option>)}
                  </select>
                </label>
                <label className="form-control block text-sm font-medium">
                  <span>{copy("symbol")}</span>
                  <select className="select select-bordered mt-1 w-full" required value={symbol}
                    onChange={(event) => setSymbol(event.target.value)}>
                    <option value="">{copy("selectSymbol")}</option>
                    {symbols.map((item) => <option key={item} value={item}>{item}</option>)}
                  </select>
                </label>
                <div className="rounded-box border border-base-300 bg-base-200/40 p-3 text-sm" aria-label={copy("scope") }>
                  <p className="font-medium">{copy("scope")}</p>
                  <p className="mt-1 break-words">{selectedBot ? `${selectedBot.name} · ${selectedBot.exchange} · ${selectedBot.marketType} · ${symbol || "—"}` : "—"}</p>
                  <p className="mt-1">{copy("action")}: {copy("placeLiveOrder")}</p>
                </div>
                <label className="form-control block text-sm font-medium">
                  <span>{copy("singleLimit")}</span>
                  <input className="input input-bordered mt-1 w-full" inputMode="decimal" required value={maxActionQuoteAmount}
                    onChange={(event) => setMaxActionQuoteAmount(event.target.value)} placeholder={copy("singleLimitExample")} />
                </label>
                <label className="form-control block text-sm font-medium">
                  <span>{copy("totalLimit")}</span>
                  <input className="input input-bordered mt-1 w-full" inputMode="decimal" required value={maxTotalQuoteAmount}
                    onChange={(event) => setMaxTotalQuoteAmount(event.target.value)} placeholder={copy("totalLimitExample")} />
                </label>
                <label className="form-control block text-sm font-medium">
                  <span>{copy("countLimit")}</span>
                  <input type="number" className="input input-bordered mt-1 w-full" min={1} max={1000} step={1} required
                    value={maxActions} onChange={(event) => setMaxActions(event.target.value)} />
                </label>
                <label className="form-control block text-sm font-medium">
                  <span>{copy("ttlMinutes")}</span>
                  <input type="number" className="input input-bordered mt-1 w-full" min={1} max={10080} step={1} required
                    value={ttlMinutes} onChange={(event) => setTtlMinutes(event.target.value)} />
                </label>
              </div>
              <label className="form-control block text-sm font-medium max-w-md">
                <span>{copy("password")}</span>
                <input type="password" className="input input-bordered mt-1 w-full" autoComplete="current-password"
                  required value={password} onChange={(event) => setPassword(event.target.value)} />
              </label>
              <p className="text-xs opacity-70">{copy("passwordHint")}</p>
              {formError ? <p role="alert" className="text-sm text-error">{formError}</p> : null}
              <button ref={createButtonRef} type="submit" className="btn btn-primary" disabled={!canCreate || saving || Boolean(issued) || readExclusive}>
                {saving ? copy("creating") : copy("create")}
              </button>
            </fieldset>
          </form>
        ) : null}
      </section>

      <section className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-lg font-semibold">{copy("listTitle")}</h3>
          <button type="button" className="btn btn-outline btn-sm" onClick={() => void load()} disabled={loading || saving || readExclusive}>
            {copy("refresh")}
          </button>
        </div>
        {actionError ? <p role="alert" className="text-sm text-error">{actionError}</p> : null}
        {!loading && !loadError && grants.length === 0 ? <p className="text-sm opacity-75">{copy("empty")}</p> : null}
        <div className="grid gap-3 lg:grid-cols-2">
          {grants.map((grant) => {
            const bot = context.bots?.find((item) => item.id === grant.botId);
            const status = getGrantStatus(grant, {
              subscription: context.subscription, botsLoaded: context.bots !== null,
              bot, graph: context.graphs[grant.botId], universes: context.universes, now,
            });
            return (
              <article key={grant.id} className="rounded-box border border-base-300 bg-base-100 p-4 space-y-3 min-w-0">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h4 className="font-semibold break-words">{grant.clientLabel}</h4>
                    <p className="text-xs opacity-70 break-all">{grant.id}</p>
                  </div>
                  <span className={`badge badge-outline ${status === "configured" ? "badge-info" : "badge-warning"}`}>
                    {copy(`status.${status}`)}
                  </span>
                </div>
                <dl className="grid grid-cols-1 gap-x-4 gap-y-2 text-sm sm:grid-cols-2">
                  <div><dt className="opacity-65">{copy("bot")}</dt><dd className="font-medium break-words">{bot?.name ?? grant.botId}</dd></div>
                  <div><dt className="opacity-65">{copy("scope")}</dt><dd>{grant.exchange} · {grant.marketType} · {grant.symbol}</dd></div>
                  <div><dt className="opacity-65">{copy("action")}</dt><dd>{copy("placeLiveOrder")}</dd></div>
                  <div><dt className="opacity-65">{copy("expires")}</dt><dd>{formatDate(grant.expiresAt)}</dd></div>
                  <div><dt className="opacity-65">{copy("singleLimit")}</dt><dd>{grant.maxActionQuoteAmount} USDT</dd></div>
                  <div><dt className="opacity-65">{copy("totalUsage")}</dt><dd>{grant.usedQuoteAmount} / {grant.maxTotalQuoteAmount} USDT</dd></div>
                  <div><dt className="opacity-65">{copy("countUsage")}</dt><dd>{grant.usedActions} / {grant.maxActions}</dd></div>
                  <div><dt className="opacity-65">{copy("created")}</dt><dd>{formatDate(grant.createdAt)}</dd></div>
                </dl>
                {status === "planUnavailable" || status === "scopeUnavailable" || status === "unverified" ?
                  <p className="text-xs text-warning">{copy(`statusHelp.${status}`)}</p> : null}
                {!grant.revokedAt ? (
                  <div className="border-t border-base-300 pt-3">
                    {confirmRevokeId === grant.id ? (
                      <div className="space-y-2">
                        <p className="text-sm">{copy("revokeConfirm")}</p>
                        <div className="flex flex-wrap gap-2">
                          <button type="button" className="btn btn-error btn-sm" disabled={revokingId === grant.id || readExclusive}
                            onClick={() => void handleRevoke(grant.id)}>{revokingId === grant.id ? copy("revoking") : copy("confirmRevoke")}</button>
                          <button type="button" className="btn btn-outline btn-sm" disabled={revokingId === grant.id || readExclusive}
                            onClick={() => setConfirmRevokeId(null)}>{copy("cancel")}</button>
                        </div>
                      </div>
                    ) : <button type="button" className="btn btn-outline btn-error btn-sm" disabled={readExclusive}
                      onClick={() => setConfirmRevokeId(grant.id)}>{copy("revoke")}</button>}
                  </div>
                ) : null}
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}
