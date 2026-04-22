"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { ZodError } from "zod";
import { isAxiosError } from "axios";
import { apiKeySchema } from "../types/apiKeyForm.type";
import { testApiKeyConnection, testStoredApiKeyConnection } from "../services/apiKeys.service";
import { useI18n } from "../../../i18n/I18nProvider";
import { listBots } from "@/features/bots/services/bots.service";
import type { Bot } from "@/features/bots/types/bot.type";
import {
  EXCHANGE_OPTIONS,
  ExchangeOption,
  supportsExchangeCapability,
} from "@/features/exchanges/exchangeCapabilities";

const EXCHANGES: ExchangeOption[] = [...EXCHANGE_OPTIONS];

export type ApiKeyFormSavePayload = {
  label: string;
  exchange: ExchangeOption;
  apiKey?: string;
  apiSecret?: string;
  syncExternalPositions: boolean;
  manageExternalPositions: boolean;
};

export type ApiKeyFormProps = {
  defaultValues?: {
    id?: string;
    label: string;
    exchange: ExchangeOption;
    maskedApiKey?: string;
    syncExternalPositions: boolean;
    manageExternalPositions: boolean;
  };
  isEdit?: boolean;
  onSave: (data: ApiKeyFormSavePayload) => void;
  onCancel: () => void;
};

export default function ApiKeyForm({ defaultValues, isEdit, onSave, onCancel }: ApiKeyFormProps) {
  const { t } = useI18n();
  const formText = useCallback((key: string) => t(`dashboard.apiKeys.form.${key}`), [t]);

  const [label, setLabel] = useState(defaultValues?.label || "");
  const [exchange, setExchange] = useState<ExchangeOption>(
    defaultValues?.exchange || EXCHANGES[0]
  );
  const [apiKey, setApiKey] = useState("");
  const [apiSecret, setApiSecret] = useState("");
  const [syncExternalPositions, setSyncExternalPositions] = useState(defaultValues?.syncExternalPositions ?? true);
  const [manageExternalPositions, setManageExternalPositions] = useState(defaultValues?.manageExternalPositions ?? false);
  const [testStatus, setTestStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [testMessage, setTestMessage] = useState<string | null>(null);
  const [testedFingerprint, setTestedFingerprint] = useState<string | null>(null);
  const [manageableBots, setManageableBots] = useState<Bot[]>([]);
  const [manageBotsStatus, setManageBotsStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const currentFingerprint = `${exchange}::${apiKey}::${apiSecret}`;
  const currentApiKeyId = defaultValues?.id ?? null;
  const binanceWhitelistIps = (process.env.NEXT_PUBLIC_BINANCE_IP_WHITELIST ?? "")
    .split(",")
    .map((ip) => ip.trim())
    .filter((ip) => ip.length > 0);

  const exchangeSupportsProbe = supportsExchangeCapability(exchange, "API_KEY_PROBE");
  const exchangeSupportsLiveExecution = supportsExchangeCapability(exchange, "LIVE_EXECUTION");
  const requiresConnectionTest = (!isEdit || Boolean(apiKey) || Boolean(apiSecret)) && exchangeSupportsProbe;
  const isManageBotListVisible = manageExternalPositions && exchange === "BINANCE";
  const usesStoredTestMode =
    Boolean(isEdit && currentApiKeyId && exchange === defaultValues?.exchange) &&
    apiKey.trim().length === 0 &&
    apiSecret.trim().length === 0;

  useEffect(() => {
    if (!isManageBotListVisible) {
      setManageBotsStatus("idle");
      return;
    }

    let isCanceled = false;
    setManageBotsStatus("loading");

    void listBots()
      .then((bots) => {
        if (isCanceled) return;
        const eligibleBots = bots.filter(
          (bot) => bot.exchange === exchange && bot.mode === "LIVE" && bot.isActive && bot.liveOptIn
        );
        setManageableBots(eligibleBots);
        setManageBotsStatus("success");
      })
      .catch(() => {
        if (isCanceled) return;
        setManageableBots([]);
        setManageBotsStatus("error");
      });

    return () => {
      isCanceled = true;
    };
  }, [exchange, isManageBotListVisible]);

  const placeholderProbeInfo = formText("placeholderProbeInfo").replace("{exchange}", exchange);

  const manageableBotRows = useMemo(
    () =>
      manageableBots.map((bot) => {
        let bindingLabel = formText("botWithoutApiKey");
        let bindingTone = "badge-ghost";

        if (bot.apiKeyId && currentApiKeyId && bot.apiKeyId === currentApiKeyId) {
          bindingLabel = formText("botUsesThisKey");
          bindingTone = "badge-success";
        } else if (bot.apiKeyId) {
          bindingLabel = formText("botUsesAnotherKey");
          bindingTone = "badge-warning";
        }

        return {
          id: bot.id,
          name: bot.name,
          marketType: bot.marketType,
          bindingLabel,
          bindingTone,
        };
      }),
    [currentApiKeyId, formText, manageableBots]
  );

  const handleTest = async () => {
    if (!exchangeSupportsProbe) {
      setTestStatus("idle");
      setTestMessage(placeholderProbeInfo);
      setTestedFingerprint(null);
      return;
    }

    const canTestStoredConnection =
      usesStoredTestMode;

    if (canTestStoredConnection) {
      setTestStatus("loading");
      setTestMessage(null);

      try {
        const result = await testStoredApiKeyConnection(currentApiKeyId as string);
        if (result.ok) {
          setTestStatus("success");
          setTestMessage(result.message ?? formText("testConnectionOk"));
          setTestedFingerprint(null);
          return;
        }

        setTestStatus("error");
        setTestMessage(result.message ?? formText("testConnectionFailed"));
        setTestedFingerprint(null);
      } catch (err: unknown) {
        const message = isAxiosError<{ message?: string }>(err)
          ? (err.response?.data?.message ?? formText("testConnectionFailed"))
          : formText("testConnectionFailed");
        setTestStatus("error");
        setTestMessage(message);
        setTestedFingerprint(null);
      }
      return;
    }

    if (!apiKey || !apiSecret) {
      setTestStatus("error");
      setTestMessage(formText("fillCredentialsBeforeTest"));
      setTestedFingerprint(null);
      return;
    }

    setTestStatus("loading");
    setTestMessage(null);

    try {
      const result = await testApiKeyConnection({ exchange, apiKey, apiSecret });
      if (result.ok) {
        setTestStatus("success");
        setTestMessage(result.message ?? formText("testConnectionOk"));
        setTestedFingerprint(currentFingerprint);
        return;
      }

      setTestStatus("error");
      setTestMessage(result.message ?? formText("testConnectionFailed"));
      setTestedFingerprint(null);
    } catch (err: unknown) {
      const message = isAxiosError<{ message?: string }>(err)
        ? (err.response?.data?.message ?? formText("testConnectionFailed"))
        : formText("testConnectionFailed");
      setTestStatus("error");
      setTestMessage(message);
      setTestedFingerprint(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEdit) {
        apiKeySchema.pick({ label: true, exchange: true }).parse({ label, exchange });
        if ((apiKey && !apiSecret) || (!apiKey && apiSecret)) {
          toast.error(formText("provideBothKeys"));
          return;
        }
      } else {
        apiKeySchema.parse({ label, exchange, apiKey, apiSecret });
      }

      if (requiresConnectionTest) {
        const hasMatchingSuccess = testStatus === "success" && testedFingerprint === currentFingerprint;
        if (!hasMatchingSuccess) {
          toast.error(formText("testBeforeSave"));
          return;
        }
      }

      const payload: ApiKeyFormSavePayload = { label, exchange, syncExternalPositions, manageExternalPositions };
      if (apiKey) payload.apiKey = apiKey;
      if (apiSecret) payload.apiSecret = apiSecret;
      onSave(payload);
    } catch (err: unknown) {
      if (err instanceof ZodError) {
        toast.error(err.issues[0]?.message || formText("validationError"));
        return;
      }
      toast.error(formText("validationError"));
    }
  };

  return (
    <form className="w-full space-y-4" onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="form-control w-full">
          <label className="label pl-0">
            <span className="label-text text-left w-full">{formText("keyName")}</span>
          </label>
          <input
            className="input input-bordered w-full"
            type="text"
            aria-label={formText("keyName")}
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            required
          />
        </div>
        <div className="form-control w-full">
          <label className="label pl-0">
            <span className="label-text text-left w-full">{formText("exchange")}</span>
          </label>
          <select
            className="select select-bordered w-full"
            aria-label={formText("exchange")}
            value={exchange}
            onChange={(e) => setExchange((e.target.value as ExchangeOption) || "BINANCE")}
          >
            {EXCHANGES.map((ex) => (
              <option key={ex} value={ex}>
                {ex}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="form-control w-full">
        <label className="label pl-0">
          <span className="label-text text-left w-full">{formText("apiKey")}</span>
        </label>
        {isEdit && defaultValues?.maskedApiKey ? (
          <div className="text-xs opacity-70 mb-1">
            {formText("currentApiKey")}: <span className="font-mono">{defaultValues.maskedApiKey}</span>
          </div>
        ) : null}
        <input
          className="input input-bordered w-full font-mono"
          type="text"
          aria-label={formText("apiKey")}
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          placeholder={isEdit ? formText("apiKeyPlaceholder") : ""}
          autoComplete="new-password"
          data-form-type="other"
          data-lpignore="true"
          spellCheck={false}
          required={!isEdit}
        />
      </div>

      <div className="form-control w-full">
        <label className="label pl-0">
          <span className="label-text text-left w-full">{formText("apiSecret")}</span>
        </label>
        <input
          className="input input-bordered w-full font-mono"
          type="password"
          aria-label={formText("apiSecret")}
          value={apiSecret}
          onChange={(e) => setApiSecret(e.target.value)}
          placeholder={isEdit ? formText("apiSecretPlaceholder") : ""}
          autoComplete="new-password"
          data-form-type="other"
          data-lpignore="true"
          spellCheck={false}
          required={!isEdit}
        />
        {isEdit ? <p className="text-xs opacity-70 mt-1">{formText("editSecretHint")}</p> : null}
      </div>

      <div className="rounded-box border border-base-300/70 bg-base-100/60 p-3">
        <label className="label cursor-pointer justify-start gap-3">
          <input
            type="checkbox"
            className="toggle toggle-primary"
            checked={syncExternalPositions}
            onChange={(e) => setSyncExternalPositions(e.target.checked)}
          />
          <span className="label-text">{formText("syncExternal")}</span>
        </label>
      </div>

      <div className="rounded-box border border-base-300/70 bg-base-100/60 p-3 space-y-3">
        <label className="label cursor-pointer justify-start gap-3">
          <input
            type="checkbox"
            className="toggle toggle-secondary"
            checked={manageExternalPositions}
            onChange={(e) => setManageExternalPositions(e.target.checked)}
          />
          <span className="label-text">{formText("manageExternal")}</span>
        </label>
        {isManageBotListVisible ? (
          <div className="rounded-box border border-base-300 bg-base-200/40 p-3 text-sm space-y-2">
            <p className="font-semibold">{formText("manageBotsTitle")}</p>
            {manageBotsStatus === "loading" ? <p>{formText("manageBotsLoading")}</p> : null}
            {manageBotsStatus === "error" ? <p className="text-error">{formText("manageBotsLoadError")}</p> : null}
            {manageBotsStatus === "success" && manageableBotRows.length === 0 ? <p>{formText("manageBotsEmpty")}</p> : null}
            {manageBotsStatus === "success" && manageableBotRows.length > 0 ? (
              <ul className="space-y-1.5">
                {manageableBotRows.map((bot) => (
                  <li key={bot.id} className="flex flex-wrap items-center gap-2">
                    <span className="font-medium">{bot.name}</span>
                    <span className="badge badge-outline badge-xs">{bot.marketType}</span>
                    <span className={`badge badge-xs ${bot.bindingTone}`}>{bot.bindingLabel}</span>
                  </li>
                ))}
              </ul>
            ) : null}
            <p className="opacity-70">{formText("manageBotsHint")}</p>
          </div>
        ) : null}
      </div>

      <div className={`grid grid-cols-1 gap-3 ${exchange === "BINANCE" ? "lg:grid-cols-2" : ""}`}>
        <div className="alert alert-info text-sm">
          <div className="space-y-2">
            <span className="badge badge-sm badge-neutral">{formText("exchangeRequirementsTitle")}</span>
            <div className="space-y-1">
              <p className="font-semibold">{formText("appSupportTitle")}</p>
              <ul className="list-disc pl-5">
                <li>
                  {formText("supportApiProbe")}:{" "}
                  <span className={exchangeSupportsProbe ? "text-success" : "text-warning"}>
                    {exchangeSupportsProbe ? formText("supportAvailable") : formText("supportUnavailable")}
                  </span>
                </li>
                <li>
                  {formText("supportLiveExecution")}:{" "}
                  <span className={exchangeSupportsLiveExecution ? "text-success" : "text-warning"}>
                    {exchangeSupportsLiveExecution ? formText("supportAvailable") : formText("supportUnavailable")}
                  </span>
                </li>
              </ul>
            </div>
            {!exchangeSupportsProbe ? (
              <div className="space-y-1">
                <span className="badge badge-sm badge-warning badge-outline">PLACEHOLDER</span>
                <span>{placeholderProbeInfo}</span>
              </div>
            ) : null}
          </div>
        </div>

        {exchange === "BINANCE" ? (
          <div className="alert alert-info text-sm">
            <div className="space-y-3">
              <div className="space-y-1">
                <p className="font-semibold">{formText("binancePermissionsTitle")}</p>
                <p>{formText("binancePermissionsLead")}</p>
                <ul className="list-disc pl-5">
                  <li>{formText("binancePermissionReading")}</li>
                  <li>{formText("binancePermissionSpotMargin")}</li>
                  <li>{formText("binancePermissionFutures")}</li>
                </ul>
                <p className="opacity-80">{formText("binancePermissionsHint")}</p>
              </div>
              <div className="space-y-2">
                <span className="badge badge-sm badge-neutral">{formText("ipWhitelistTitle")}</span>
                {binanceWhitelistIps.length > 0 ? (
                  <>
                    <p>{formText("ipWhitelistLead")}</p>
                    <ul className="list-disc pl-5 font-mono">
                      {binanceWhitelistIps.map((ip) => (
                        <li key={ip}>{ip}</li>
                      ))}
                    </ul>
                  </>
                ) : (
                  <p>{formText("ipWhitelistMissing")}</p>
                )}
                <p className="opacity-80">{formText("ipWhitelistHint")}</p>
              </div>
            </div>
          </div>
        ) : null}
      </div>
      <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
        <div className="flex min-h-8 items-center gap-3">
          <button
            className="btn btn-outline btn-info min-w-44 justify-center gap-2"
            type="button"
            onClick={handleTest}
            disabled={testStatus === "loading" || !exchangeSupportsProbe}
          >
            {testStatus === "loading" ? (
              <span className="loading loading-spinner loading-xs" aria-hidden="true" />
            ) : null}
            <span>
              {testStatus === "loading"
                ? formText("testing")
                : usesStoredTestMode
                  ? formText("testStoredConnection")
                  : formText("testConnection")}
            </span>
          </button>
          {testStatus === "success" && <span className="text-success">{formText("ok")}</span>}
          {testStatus === "error" && <span className="text-error">{formText("error")}</span>}
        </div>
        <div className="flex items-center gap-2">
          <button className="btn btn-primary" type="submit">
            {formText("save")}
          </button>
          <button className="btn btn-outline" type="button" onClick={onCancel}>
            {formText("cancel")}
          </button>
        </div>
      </div>
      {testMessage && (
        <p className={`text-sm ${testStatus === "error" ? "text-error" : "text-success"}`}>{testMessage}</p>
      )}
    </form>
  );
}
