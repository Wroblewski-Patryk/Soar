"use client";

import type { Dispatch, SetStateAction } from "react";
import type { AssistantDecisionTrace, Bot, BotSubagentConfig } from "../types/bot.type";
import type { TranslationKey } from "../../../i18n/translations";
import { EmptyState } from "../../../ui/components/ViewState";
import { SkeletonCardBlock, SkeletonFormBlock } from "../../../ui/components/loading";

type BotsAssistantTabProps = {
  t: (key: TranslationKey) => string;
  bots: Bot[];
  assistantBotId: string;
  assistantDryRunInterval: string;
  assistantDryRunRunning: boolean;
  assistantDryRunSymbol: string;
  assistantLatencyMs: number;
  assistantLoading: boolean;
  assistantMainEnabled: boolean;
  assistantMandate: string;
  assistantModelProfile: string;
  assistantSafetyMode: "STRICT" | "BALANCED" | "EXPERIMENTAL";
  assistantSaving: boolean;
  assistantSlots: BotSubagentConfig[];
  assistantTrace: AssistantDecisionTrace | null;
  handleClearSubagent: (slotIndex: number) => Promise<void>;
  handleRunAssistantDryRun: () => Promise<void>;
  handleSaveAssistantMain: () => Promise<void>;
  handleSaveSubagent: (slot: BotSubagentConfig) => Promise<void>;
  setAssistantBotId: (botId: string) => void;
  setAssistantDryRunInterval: (value: string) => void;
  setAssistantDryRunSymbol: (value: string) => void;
  setAssistantLatencyMs: (value: number) => void;
  setAssistantMainEnabled: (value: boolean) => void;
  setAssistantMandate: (value: string) => void;
  setAssistantModelProfile: (value: string) => void;
  setAssistantSafetyMode: (value: "STRICT" | "BALANCED" | "EXPERIMENTAL") => void;
  setAssistantSubagents: Dispatch<SetStateAction<BotSubagentConfig[]>>;
  interpolateTemplate: (template: string, values: Record<string, string | number>) => string;
};

export function BotsAssistantTab({
  t,
  bots,
  assistantBotId,
  assistantDryRunInterval,
  assistantDryRunRunning,
  assistantDryRunSymbol,
  assistantLatencyMs,
  assistantLoading,
  assistantMainEnabled,
  assistantMandate,
  assistantModelProfile,
  assistantSafetyMode,
  assistantSaving,
  assistantSlots,
  assistantTrace,
  handleClearSubagent,
  handleRunAssistantDryRun,
  handleSaveAssistantMain,
  handleSaveSubagent,
  setAssistantBotId,
  setAssistantDryRunInterval,
  setAssistantDryRunSymbol,
  setAssistantLatencyMs,
  setAssistantMainEnabled,
  setAssistantMandate,
  setAssistantModelProfile,
  setAssistantSafetyMode,
  setAssistantSubagents,
  interpolateTemplate,
}: BotsAssistantTabProps) {
  return (
    <div className="space-y-4 rounded-box border border-base-300/60 bg-base-200/60 p-4">
      <h2 className="text-lg font-semibold">{t("dashboard.bots.assistant.title")}</h2>
      <p className="text-sm opacity-70">{t("dashboard.bots.assistant.description")}</p>

      {bots.length === 0 ? (
        <EmptyState
          title={t("dashboard.bots.assistant.emptyTitle")}
          description={t("dashboard.bots.assistant.emptyDescription")}
        />
      ) : (
        <>
          <label className="form-control max-w-sm">
            <span className="label-text">{t("dashboard.bots.assistant.botLabel")}</span>
            <select
              className="select select-bordered"
              value={assistantBotId}
              onChange={(event) => setAssistantBotId(event.target.value)}
            >
              {bots.map((bot) => (
                <option key={bot.id} value={bot.id}>
                  {bot.name}
                </option>
              ))}
            </select>
          </label>

          {assistantLoading ? (
            <div className="space-y-3" aria-busy="true" aria-label={t("dashboard.bots.assistant.loading")}>
              <SkeletonFormBlock
                fields={7}
                columns={2}
                title={false}
                submitButton={false}
                className="border-base-300/40 bg-base-100/60 p-3"
              />
              <SkeletonCardBlock cards={4} linesPerCard={3} title={false} className="border-base-300/40 bg-base-100/60 p-3" />
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid gap-3 md:grid-cols-5">
                <label className="form-control">
                  <span className="label-text">{t("dashboard.bots.assistant.mainEnabledLabel")}</span>
                  <input
                    type="checkbox"
                    className="toggle toggle-success"
                    checked={assistantMainEnabled}
                    onChange={(event) => setAssistantMainEnabled(event.target.checked)}
                  />
                </label>
                <label className="form-control md:col-span-2">
                  <span className="label-text">{t("dashboard.bots.assistant.mandateLabel")}</span>
                  <input
                    className="input input-bordered"
                    value={assistantMandate}
                    onChange={(event) => setAssistantMandate(event.target.value)}
                    placeholder={t("dashboard.bots.assistant.mandatePlaceholder")}
                  />
                </label>
                <label className="form-control">
                  <span className="label-text">{t("dashboard.bots.assistant.modelProfileLabel")}</span>
                  <input
                    className="input input-bordered"
                    value={assistantModelProfile}
                    onChange={(event) => setAssistantModelProfile(event.target.value)}
                  />
                </label>
                <label className="form-control">
                  <span className="label-text">{t("dashboard.bots.assistant.safetyModeLabel")}</span>
                  <select
                    className="select select-bordered"
                    value={assistantSafetyMode}
                    onChange={(event) =>
                      setAssistantSafetyMode(event.target.value as "STRICT" | "BALANCED" | "EXPERIMENTAL")
                    }
                  >
                    <option value="STRICT">STRICT</option>
                    <option value="BALANCED">BALANCED</option>
                    <option value="EXPERIMENTAL">EXPERIMENTAL</option>
                  </select>
                </label>
              </div>
              <label className="form-control max-w-xs">
                <span className="label-text">{t("dashboard.bots.assistant.mainLatencyLabel")}</span>
                <input
                  type="number"
                  className="input input-bordered"
                  min={200}
                  max={30000}
                  value={assistantLatencyMs}
                  onChange={(event) => setAssistantLatencyMs(Number(event.target.value))}
                />
              </label>
              <div className="flex justify-end">
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  disabled={assistantSaving || !assistantBotId}
                  onClick={() => void handleSaveAssistantMain()}
                >
                  {assistantSaving ? t("dashboard.bots.assistant.saving") : t("dashboard.bots.assistant.saveMain")}
                </button>
              </div>

              <div className="space-y-3">
                {assistantSlots.map((slot) => (
                  <div key={slot.slotIndex} className="rounded-lg border border-base-300 p-3">
                    <div className="mb-2 font-medium">
                      {interpolateTemplate(t("dashboard.bots.assistant.subagentSlotTitle"), {
                        slot: slot.slotIndex,
                      })}
                    </div>
                    <div className="grid gap-3 md:grid-cols-5">
                      <label className="form-control">
                        <span className="label-text">{t("dashboard.bots.assistant.enabledLabel")}</span>
                        <input
                          type="checkbox"
                          className="toggle toggle-sm"
                          checked={slot.enabled}
                          onChange={(event) =>
                            setAssistantSubagents((prev) => {
                              const next = [...prev];
                              const idx = next.findIndex((item) => item.slotIndex === slot.slotIndex);
                              const updated = { ...slot, enabled: event.target.checked };
                              if (idx >= 0) next[idx] = updated;
                              else next.push(updated);
                              return next;
                            })
                          }
                        />
                      </label>
                      <label className="form-control">
                        <span className="label-text">{t("dashboard.bots.assistant.roleLabel")}</span>
                        <input
                          className="input input-bordered input-sm"
                          value={slot.role}
                          onChange={(event) =>
                            setAssistantSubagents((prev) => {
                              const next = [...prev];
                              const idx = next.findIndex((item) => item.slotIndex === slot.slotIndex);
                              const updated = { ...slot, role: event.target.value };
                              if (idx >= 0) next[idx] = updated;
                              else next.push(updated);
                              return next;
                            })
                          }
                        />
                      </label>
                      <label className="form-control">
                        <span className="label-text">{t("dashboard.bots.assistant.profileLabel")}</span>
                        <input
                          className="input input-bordered input-sm"
                          value={slot.modelProfile}
                          onChange={(event) =>
                            setAssistantSubagents((prev) => {
                              const next = [...prev];
                              const idx = next.findIndex((item) => item.slotIndex === slot.slotIndex);
                              const updated = { ...slot, modelProfile: event.target.value };
                              if (idx >= 0) next[idx] = updated;
                              else next.push(updated);
                              return next;
                            })
                          }
                        />
                      </label>
                      <label className="form-control">
                        <span className="label-text">{t("dashboard.bots.assistant.timeoutLabel")}</span>
                        <input
                          type="number"
                          min={100}
                          max={15000}
                          className="input input-bordered input-sm"
                          value={slot.timeoutMs}
                          onChange={(event) =>
                            setAssistantSubagents((prev) => {
                              const next = [...prev];
                              const idx = next.findIndex((item) => item.slotIndex === slot.slotIndex);
                              const updated = { ...slot, timeoutMs: Number(event.target.value) };
                              if (idx >= 0) next[idx] = updated;
                              else next.push(updated);
                              return next;
                            })
                          }
                        />
                      </label>
                      <label className="form-control">
                        <span className="label-text">{t("dashboard.bots.assistant.safetyLabel")}</span>
                        <select
                          className="select select-bordered select-sm"
                          value={slot.safetyMode}
                          onChange={(event) =>
                            setAssistantSubagents((prev) => {
                              const next = [...prev];
                              const idx = next.findIndex((item) => item.slotIndex === slot.slotIndex);
                              const updated = {
                                ...slot,
                                safetyMode: event.target.value as "STRICT" | "BALANCED" | "EXPERIMENTAL",
                              };
                              if (idx >= 0) next[idx] = updated;
                              else next.push(updated);
                              return next;
                            })
                          }
                        >
                          <option value="STRICT">STRICT</option>
                          <option value="BALANCED">BALANCED</option>
                          <option value="EXPERIMENTAL">EXPERIMENTAL</option>
                        </select>
                      </label>
                    </div>
                    <div className="mt-3 flex gap-2">
                      <button
                        type="button"
                        className="btn btn-primary btn-xs"
                        disabled={assistantSaving || !assistantBotId}
                        onClick={() => void handleSaveSubagent(slot)}
                      >
                        {t("dashboard.bots.assistant.saveSlot")}
                      </button>
                      <button
                        type="button"
                        className="btn btn-ghost btn-xs"
                        disabled={assistantSaving || !assistantBotId}
                        onClick={() => void handleClearSubagent(slot.slotIndex)}
                      >
                        {t("dashboard.bots.assistant.deleteSlot")}
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="rounded-lg border border-base-300 p-3">
                <div className="mb-2 font-medium">{t("dashboard.bots.assistant.decisionTimelineTitle")}</div>
                <div className="grid gap-3 md:grid-cols-4">
                  <label className="form-control">
                    <span className="label-text">{t("dashboard.bots.assistant.symbolLabel")}</span>
                    <input
                      className="input input-bordered input-sm"
                      value={assistantDryRunSymbol}
                      onChange={(event) => setAssistantDryRunSymbol(event.target.value.toUpperCase())}
                    />
                  </label>
                  <label className="form-control">
                    <span className="label-text">{t("dashboard.bots.assistant.intervalLabel")}</span>
                    <input
                      className="input input-bordered input-sm"
                      value={assistantDryRunInterval}
                      onChange={(event) => setAssistantDryRunInterval(event.target.value)}
                    />
                  </label>
                  <div className="flex items-end">
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      disabled={assistantDryRunRunning || !assistantBotId}
                      onClick={() => void handleRunAssistantDryRun()}
                    >
                      {assistantDryRunRunning ? t("dashboard.bots.assistant.running") : t("dashboard.bots.assistant.runDryRun")}
                    </button>
                  </div>
                </div>

                {assistantTrace ? (
                  <div className="mt-4 space-y-3">
                    <div className="rounded-md border border-base-300 p-2 text-sm">
                      <div>{t("dashboard.bots.assistant.traceRequest")}: {assistantTrace.requestId}</div>
                      <div>{t("dashboard.bots.assistant.traceMode")}: {assistantTrace.mode}</div>
                      <div>{t("dashboard.bots.assistant.traceFinalDecision")}: {assistantTrace.finalDecision}</div>
                      <div>{t("dashboard.bots.assistant.traceReason")}: {assistantTrace.finalReason}</div>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="table table-xs">
                        <thead>
                          <tr>
                            <th>{t("dashboard.bots.assistant.traceTableSlot")}</th>
                            <th>{t("dashboard.bots.assistant.traceTableRole")}</th>
                            <th>{t("dashboard.bots.assistant.traceTableStatus")}</th>
                            <th>{t("dashboard.bots.assistant.traceTableLatency")}</th>
                            <th>{t("dashboard.bots.assistant.traceTableMessage")}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {assistantTrace.statuses.map((status) => (
                            <tr key={`${status.slotIndex}-${status.role}`}>
                              <td>{status.slotIndex}</td>
                              <td>{status.role}</td>
                              <td>{status.status}</td>
                              <td>{status.latencyMs}</td>
                              <td>{status.message ?? "-"}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
