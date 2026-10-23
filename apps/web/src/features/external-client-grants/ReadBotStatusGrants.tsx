"use client";

import { isAxiosError } from "axios";
import { useCallback, useEffect, useLayoutEffect, useRef, useState, type FormEvent } from "react";
import { useI18n } from "@/i18n/I18nProvider";
import { listBots } from "@/features/bots/services/bots.service";
import type { Bot } from "@/features/bots/types/bot.type";
import { getProfileSubscription } from "@/features/profile/services/subscription.service";
import type { ProfileSubscriptionResponse } from "@/features/profile/types/subscription.type";
import { subscriptionAllowsGrant } from "./grantStatus";
import {
  createExternalClientReadGrant, getExternalClientReadGrant, listExternalClientReadGrants,
  revokeExternalClientReadGrant, type ExternalClientReadGrant,
} from "./readGrants.api";

export default function ReadBotStatusGrants({ blocked = false, onExclusiveChange }: {
  blocked?: boolean;
  onExclusiveChange?: (exclusive: boolean) => void;
}) {
  const { t, locale, timeZone } = useI18n();
  const copy = useCallback((key: string) => t(`dashboard.externalGrants.read.${key}`), [t]);
  const [grants, setGrants] = useState<ExternalClientReadGrant[]>([]);
  const [bots, setBots] = useState<Bot[] | null>(null);
  const [subscription, setSubscription] = useState<ProfileSubscriptionResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [botId, setBotId] = useState("");
  const [clientLabel, setClientLabel] = useState("");
  const [ttlMinutes, setTtlMinutes] = useState("60");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState("");
  const [actionError, setActionError] = useState("");
  const [saving, setSaving] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [confirmRevokeId, setConfirmRevokeId] = useState<string | null>(null);
  const [issued, setIssued] = useState<{ secret: string; grant: ExternalClientReadGrant } | null>(null);
  const [copied, setCopied] = useState(false);
  const [now, setNow] = useState(() => Date.now());
  const secretDialogRef = useRef<HTMLElement>(null);
  const createButtonRef = useRef<HTMLButtonElement>(null);
  const restoreFocusRef = useRef(false);

  const closeSecret = useCallback(() => {
    setIssued(null);
    setCopied(false);
    onExclusiveChange?.(false);
  }, [onExclusiveChange]);

  useLayoutEffect(() => {
    if (!issued) {
      if (restoreFocusRef.current) createButtonRef.current?.focus();
      restoreFocusRef.current = false;
      return;
    }
    const dialog = secretDialogRef.current;
    if (!dialog) return;
    const controls = () => Array.from(dialog.querySelectorAll<HTMLElement>(
      'button:not([disabled]), [tabindex]:not([tabindex="-1"])',
    ));
    controls()[0]?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        event.stopPropagation();
        closeSecret();
      } else if (event.key === "Tab") {
        const items = controls();
        const first = items[0];
        const last = items[items.length - 1];
        if (!first || !last) {
          event.preventDefault();
          dialog.focus();
        } else if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    const onFocusIn = (event: FocusEvent) => {
      if (!dialog.contains(event.target as Node)) controls()[0]?.focus();
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
    const [grantsResult, botsResult, subscriptionResult] = await Promise.allSettled([
      listExternalClientReadGrants(), listBots(), getProfileSubscription(),
    ]);
    if (grantsResult.status === "fulfilled") setGrants(grantsResult.value);
    else setLoadError(true);
    setBots(botsResult.status === "fulfilled" ? botsResult.value : null);
    setSubscription(subscriptionResult.status === "fulfilled" ? subscriptionResult.value : null);
    setNow(Date.now());
    setLoading(false);
  }, []);

  useEffect(() => { void load(); }, [load]);
  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 60_000);
    return () => window.clearInterval(timer);
  }, []);

  const canCreate = !blocked && !loading && !loadError &&
    Boolean(bots?.length && subscription && subscriptionAllowsGrant(subscription));
  const formatDate = (value: string) => {
    const timestamp = Date.parse(value);
    return Number.isFinite(timestamp)
      ? new Intl.DateTimeFormat(locale, { dateStyle: "medium", timeStyle: "short", timeZone }).format(timestamp)
      : value;
  };
  const statusOf = (grant: ExternalClientReadGrant) => {
    if (grant.revokedAt) return "revoked";
    const expiry = Date.parse(grant.expiresAt);
    if (!Number.isFinite(expiry)) return "unverified";
    if (expiry <= now) return "expired";
    if (loadError || !bots || !subscription) return "unverified";
    if (!subscriptionAllowsGrant(subscription)) return "planUnavailable";
    if (!bots.some((bot) => bot.id === grant.botId)) return "scopeUnavailable";
    return "issued";
  };

  const handleCreate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError("");
    const minutes = Number(ttlMinutes);
    if (!canCreate || !bots?.some((bot) => bot.id === botId) || !clientLabel.trim() || !password ||
        !Number.isInteger(minutes) || minutes < 1 || minutes > 10080) {
      setFormError(copy("validationError"));
      return;
    }
    setSaving(true);
    onExclusiveChange?.(true);
    let created = false;
    try {
      const result = await createExternalClientReadGrant({
        botId, clientLabel: clientLabel.trim(), action: "READ_BOT_STATUS",
        ttlSeconds: minutes * 60, password,
      });
      setGrants((current) => [result.grant, ...current]);
      setPassword("");
      setClientLabel("");
      setCopied(false);
      restoreFocusRef.current = true;
      setIssued(result);
      created = true;
    } catch (error) {
      const message = isAxiosError(error) ? error.response?.data?.error?.message : null;
      setFormError(message === "Invalid password" ? copy("passwordError")
        : message === "Bot not found" ? copy("scopeError")
        : message === "SUBSCRIPTION_ASSIGNMENT_REQUIRED" ||
          message === "live trading is not available on the active subscription plan"
          ? copy("planError") : copy("createError"));
    } finally {
      setSaving(false);
      if (!created) onExclusiveChange?.(false);
    }
  };

  const inspect = async (id: string) => {
    setActionError("");
    setBusyId(id);
    try {
      const grant = await getExternalClientReadGrant(id);
      setGrants((current) => current.map((item) => item.id === id ? grant : item));
      setNow(Date.now());
    } catch {
      setActionError(copy("inspectError"));
    } finally {
      setBusyId(null);
    }
  };

  const revoke = async (id: string) => {
    setActionError("");
    setBusyId(id);
    try {
      const grant = await revokeExternalClientReadGrant(id);
      setGrants((current) => current.map((item) => item.id === id ? grant : item));
      setConfirmRevokeId(null);
    } catch {
      setActionError(copy("revokeError"));
    } finally {
      setBusyId(null);
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
    <section className="rounded-box border border-info/50 bg-base-100 p-4 sm:p-5 space-y-4 min-w-0" data-testid="read-bot-status-grants">
      <div>
        <h3 className="text-lg font-semibold">{copy("title")}</h3>
        <p className="text-sm opacity-75">{copy("description")}</p>
      </div>
      {issued ? (
        <section role="dialog" aria-modal="true" aria-label={copy("secretTitle")}
          ref={secretDialogRef} tabIndex={-1}
          className="rounded-box border-2 border-primary bg-base-100 p-4 space-y-3 min-w-0">
          <h4 className="font-semibold">{copy("secretTitle")}</h4>
          <p className="text-sm">{copy("secretWarning")}</p>
          <p className="text-xs break-all">{issued.grant.clientLabel} · {issued.grant.botId} · {copy("action")}</p>
          <code className="block rounded-box border border-base-300 bg-base-200 p-3 break-all select-all text-sm" data-testid="read-grant-secret">
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

      <button type="button" className="btn btn-outline btn-info btn-sm max-w-full whitespace-normal h-auto min-h-9"
        aria-expanded={formOpen} aria-controls="read-grant-form"
        disabled={blocked || Boolean(issued)} onClick={() => setFormOpen((current) => !current)}>
        {formOpen ? copy("hideForm") : copy("showForm")}
      </button>
      {formOpen ? (
        <form id="read-grant-form" onSubmit={(event) => void handleCreate(event)} className="space-y-4">
          <fieldset disabled={!canCreate || saving || Boolean(issued)} className="space-y-4">
            <p className="rounded-box border border-info/40 bg-info/10 p-3 text-sm">{copy("scopeWarning")}</p>
            {loading ? <p role="status" className="text-sm">{copy("loading")}</p> : null}
            {!loading && (!bots || !subscription) ? <p className="text-sm text-warning">{copy("contextUnavailable")}</p> : null}
            {!loading && subscription && !subscriptionAllowsGrant(subscription) ?
              <p className="text-sm text-warning">{copy("planUnavailable")}</p> : null}
            {!loading && bots?.length === 0 ? <p className="text-sm text-warning">{copy("noBots")}</p> : null}
            <div className="grid gap-4 sm:grid-cols-2 min-w-0">
              <label className="form-control block text-sm font-medium min-w-0">
                <span>{copy("clientLabel")}</span>
                <input className="input input-bordered mt-1 w-full min-w-0" maxLength={100} required value={clientLabel}
                  onChange={(event) => setClientLabel(event.target.value)} autoComplete="off" />
              </label>
              <label className="form-control block text-sm font-medium min-w-0">
                <span>{copy("bot")}</span>
                <select className="select select-bordered mt-1 w-full min-w-0" required value={botId}
                  onChange={(event) => setBotId(event.target.value)}>
                  <option value="">{copy("selectBot")}</option>
                  {(bots ?? []).map((bot) => <option key={bot.id} value={bot.id}>{bot.name} · {bot.mode}</option>)}
                </select>
              </label>
              <label className="form-control block text-sm font-medium min-w-0">
                <span>{copy("ttlMinutes")}</span>
                <input type="number" className="input input-bordered mt-1 w-full min-w-0" min={1} max={10080} step={1}
                  required value={ttlMinutes} onChange={(event) => setTtlMinutes(event.target.value)} />
              </label>
              <label className="form-control block text-sm font-medium min-w-0">
                <span>{copy("password")}</span>
                <input type="password" className="input input-bordered mt-1 w-full min-w-0" autoComplete="current-password"
                  required value={password} onChange={(event) => setPassword(event.target.value)} />
              </label>
            </div>
            {formError ? <p role="alert" className="text-sm text-error">{formError}</p> : null}
            <button ref={createButtonRef} type="submit" className="btn btn-primary max-w-full whitespace-normal h-auto min-h-10"
              disabled={!canCreate || saving || Boolean(issued)}>{saving ? copy("creating") : copy("create")}</button>
          </fieldset>
        </form>
      ) : null}

      <div className="flex flex-wrap items-center justify-between gap-2">
        <h4 className="font-semibold">{copy("listTitle")}</h4>
        <button type="button" className="btn btn-outline btn-sm" onClick={() => void load()}
          disabled={blocked || loading || saving || Boolean(issued)}>{copy("refresh")}</button>
      </div>
      {loading ? <p role="status" className="text-sm">{copy("loading")}</p> : null}
      {loadError ? <p role="alert" className="text-sm text-error">{copy("loadError")}</p> : null}
      {actionError ? <p role="alert" className="text-sm text-error">{actionError}</p> : null}
      {!loading && !loadError && grants.length === 0 ? <p className="text-sm opacity-75">{copy("empty")}</p> : null}
      <div className="grid gap-3 lg:grid-cols-2 min-w-0">
        {grants.map((grant) => {
          const status = statusOf(grant);
          const bot = bots?.find((item) => item.id === grant.botId);
          return (
            <article key={grant.id} className="rounded-box border border-base-300 p-4 space-y-3 min-w-0">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="min-w-0">
                  <h5 className="font-semibold break-words">{grant.clientLabel}</h5>
                  <p className="text-xs opacity-70 break-all">{grant.id}</p>
                </div>
                <span className={`badge badge-outline ${status === "issued" ? "badge-info" : "badge-warning"}`}>
                  {copy(`status.${status}`)}
                </span>
              </div>
              <dl className="grid grid-cols-1 gap-x-4 gap-y-2 text-sm sm:grid-cols-2 min-w-0">
                <div className="min-w-0"><dt className="opacity-65">{copy("bot")}</dt><dd className="break-words">{bot?.name ?? grant.botId}</dd></div>
                <div><dt className="opacity-65">{copy("actionLabel")}</dt><dd>{copy("action")}</dd></div>
                <div><dt className="opacity-65">{copy("expires")}</dt><dd>{formatDate(grant.expiresAt)}</dd></div>
                <div><dt className="opacity-65">{copy("created")}</dt><dd>{formatDate(grant.createdAt)}</dd></div>
              </dl>
              {status === "unverified" || status === "planUnavailable" || status === "scopeUnavailable" ?
                <p className="text-xs text-warning">{copy(`statusHelp.${status}`)}</p> : null}
              <div className="flex flex-wrap gap-2 border-t border-base-300 pt-3">
                <button type="button" className="btn btn-outline btn-sm" disabled={blocked || Boolean(busyId) || Boolean(issued)}
                  onClick={() => void inspect(grant.id)}>{busyId === grant.id ? copy("checking") : copy("inspect")}</button>
                {!grant.revokedAt && confirmRevokeId !== grant.id ?
                  <button type="button" className="btn btn-outline btn-error btn-sm" disabled={blocked || Boolean(busyId) || Boolean(issued)}
                    onClick={() => setConfirmRevokeId(grant.id)}>{copy("revoke")}</button> : null}
              </div>
              {confirmRevokeId === grant.id && !grant.revokedAt ? (
                <div className="space-y-2">
                  <p className="text-sm">{copy("revokeConfirm")}</p>
                  <div className="flex flex-wrap gap-2">
                    <button type="button" className="btn btn-error btn-sm" disabled={blocked || Boolean(busyId) || Boolean(issued)}
                      onClick={() => void revoke(grant.id)}>{busyId === grant.id ? copy("revoking") : copy("confirmRevoke")}</button>
                    <button type="button" className="btn btn-outline btn-sm" disabled={blocked || Boolean(busyId) || Boolean(issued)}
                      onClick={() => setConfirmRevokeId(null)}>{copy("cancel")}</button>
                  </div>
                </div>
              ) : null}
            </article>
          );
        })}
      </div>
    </section>
  );
}
