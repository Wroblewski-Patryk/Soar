"use client";

import { isAxiosError } from "axios";
import { FormEvent, useCallback, useEffect, useState } from "react";
import { useI18n } from "@/i18n/I18nProvider";
import {
  getLiveExecutionPause, updateLiveExecutionPause,
  type LiveExecutionPauseStatus,
} from "./liveExecution.service";

export default function LiveExecutionPage() {
  const { t } = useI18n();
  const [status, setStatus] = useState<LiveExecutionPauseStatus | null>(null);
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      setStatus(await getLiveExecutionPause());
      setError(null);
    } catch {
      setStatus(null);
      setError(t("admin.liveExecution.unavailable"));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => { void refresh(); }, [refresh]);

  const changeState = async (event: FormEvent, paused: boolean) => {
    event.preventDefault();
    if (!status?.available || status.version == null || reason.trim().length < 10) return;
    setSaving(true);
    setError(null);
    try {
      const written = await updateLiveExecutionPause({
        paused, reason: reason.trim(), expectedVersion: status.version,
      });
      const confirmed = await getLiveExecutionPause();
      if (!confirmed.available || confirmed.paused !== paused || confirmed.version !== written.version) {
        throw new Error("Readback mismatch");
      }
      setStatus(confirmed);
      setReason("");
    } catch (error) {
      const submissionInFlight = paused && isAxiosError(error) &&
        error.response?.data?.error?.details?.code === "LIVE_PAUSE_SUBMISSION_IN_FLIGHT";
      setError(t(submissionInFlight
        ? "admin.liveExecution.submissionInFlight" : "admin.liveExecution.updateError"));
      try { setStatus(await getLiveExecutionPause()); } catch { setStatus(null); }
    } finally {
      setSaving(false);
    }
  };

  return <section className="mx-auto w-full max-w-3xl space-y-6 px-4 py-8">
    <div>
      <h1 className="text-2xl font-semibold">{t("admin.liveExecution.title")}</h1>
      <p className="mt-2 text-base-content/70">{t("admin.liveExecution.description")}</p>
    </div>
    <div className="rounded-xl border border-base-300 bg-base-200 p-5 space-y-3" aria-live="polite">
      <p className="font-semibold">{loading ? t("admin.liveExecution.loading")
        : !status?.available ? t("admin.liveExecution.unavailable")
        : status.paused ? t("admin.liveExecution.paused") : t("admin.liveExecution.active")}</p>
      {status?.available && <>
        <p>{t("admin.liveExecution.reasonLabel")}: {status.reason}</p>
        <p className="text-sm text-base-content/70">{t("admin.liveExecution.versionLabel")}: {status.version}</p>
        <p className="text-sm text-base-content/70">{t("admin.liveExecution.changedLabel")}: {status.changedAt}</p>
      </>}
      <button type="button" className="btn btn-outline btn-sm" onClick={() => void refresh()} disabled={loading || saving}>
        {t("admin.liveExecution.refresh")}
      </button>
    </div>
    <p className="text-sm text-base-content/70">{t("admin.liveExecution.scope")}</p>
    <form className="space-y-4" onSubmit={(event) => void changeState(event, !status?.paused)}>
      <label className="form-control block">
        <span className="label-text">{t("admin.liveExecution.reasonInput")}</span>
        <textarea className="textarea textarea-bordered mt-2 w-full" value={reason}
          onChange={(event) => setReason(event.target.value)} minLength={10} maxLength={500} required
          disabled={!status?.available || saving} />
      </label>
      {error && <p role="alert" className="text-error">{error}</p>}
      <button type="submit" className={status?.paused ? "btn btn-warning" : "btn btn-error"}
        disabled={!status?.available || saving || reason.trim().length < 10}>
        {status?.paused ? t("admin.liveExecution.resume") : t("admin.liveExecution.pause")}
      </button>
    </form>
  </section>;
}
