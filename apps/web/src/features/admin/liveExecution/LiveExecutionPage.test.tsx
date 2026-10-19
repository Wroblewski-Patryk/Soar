import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { I18nProvider } from "@/i18n/I18nProvider";
import LiveExecutionPage from "./LiveExecutionPage";

const api = vi.hoisted(() => ({
  get: vi.fn(),
  update: vi.fn(),
}));
vi.mock("./liveExecution.service", () => ({
  getLiveExecutionPause: api.get,
  updateLiveExecutionPause: api.update,
}));

describe("LIVE execution admin panel", () => {
  beforeEach(() => {
    api.get.mockReset(); api.update.mockReset();
    window.localStorage.setItem("cryptosparrow-locale", "en");
    window.history.pushState({}, "", "/admin/live-execution");
  });
  afterEach(() => {
    window.localStorage.removeItem("cryptosparrow-locale");
    window.history.pushState({}, "", "/");
  });

  it("shows committed pause state and verifies resume with a second read", async () => {
    const paused = { available: true, paused: true, reason: "initial rollout",
      version: 1, changedAt: "2026-10-18T00:00:00.000Z", changedByUserId: null };
    const active = { ...paused, paused: false, reason: "all writers verified", version: 2 };
    api.get.mockResolvedValueOnce(paused).mockResolvedValueOnce(active);
    api.update.mockResolvedValue(active);
    render(<I18nProvider><LiveExecutionPage /></I18nProvider>);

    expect(await screen.findByText("LIVE submissions paused")).toBeInTheDocument();
    const button = screen.getByRole("button", { name: "Resume LIVE submissions" });
    expect(button).toBeDisabled();
    fireEvent.change(screen.getByRole("textbox", { name: /Reason for change/ }), {
      target: { value: "All LIVE writers run the gated SHA" },
    });
    fireEvent.click(button);
    await waitFor(() => expect(api.update).toHaveBeenCalledWith({
      paused: false, reason: "All LIVE writers run the gated SHA", expectedVersion: 1,
    }));
    expect(await screen.findByText("LIVE submissions active")).toBeInTheDocument();
    expect(api.get).toHaveBeenCalledTimes(2);
  });

  it.each([
    ["en", "LIVE submissions active", "This request did NOT activate the LIVE pause", "Stop LIVE writers at the platform level", "Do not automatically retry or clean up", "Version: 8"],
    ["pl", "Wysylanie zlecen LIVE aktywne", "Ta proba NIE wlaczyla pauzy LIVE", "Zatrzymaj procesy wysylajace zlecenia LIVE", "Nie ponawiaj automatycznie ani nie usuwaj automatycznie markera", "Wersja: 8"],
  ])("shows the in-flight refusal in %s while retaining true status and version", async (
    locale, activeLabel, refusal, platformAction, noRetry, versionLabel,
  ) => {
    window.localStorage.setItem("cryptosparrow-locale", locale);
    const active = { available: true, paused: false, reason: "writers active",
      version: 7, changedAt: "2026-10-19T00:00:00.000Z", changedByUserId: null };
    api.get.mockImplementation(async () => api.update.mock.calls.length > 0
      ? { ...active, version: 8 } : active);
    api.update.mockRejectedValue(Object.assign(new Error("in flight"), {
      isAxiosError: true,
      response: { status: 503, data: { error: {
        details: { code: "LIVE_PAUSE_SUBMISSION_IN_FLIGHT" },
      } } },
    }));
    render(<I18nProvider><LiveExecutionPage /></I18nProvider>);
    expect(await screen.findByText(activeLabel)).toBeInTheDocument();
    fireEvent.change(screen.getByRole("textbox"), { target: { value: "Stop writers before pause" } });
    fireEvent.click(screen.getByRole("button", { name: locale === "pl" ? "Wstrzymaj LIVE" : "Pause LIVE submissions" }));

    const alert = await screen.findByRole("alert");
    expect(alert).toHaveTextContent(refusal);
    expect(alert).toHaveTextContent(platformAction);
    expect(alert).toHaveTextContent("clientOrderId");
    expect(alert).toHaveTextContent("intent");
    expect(alert).toHaveTextContent("runbook");
    expect(alert).toHaveTextContent(noRetry);
    await waitFor(() => expect(api.get.mock.invocationCallOrder.some(
      (order) => order > api.update.mock.invocationCallOrder[0],
    )).toBe(true));
    expect(screen.getByText(activeLabel)).toBeInTheDocument();
    expect(screen.getByText(versionLabel)).toBeInTheDocument();
    expect(api.update).toHaveBeenCalledWith({
      paused: true, reason: "Stop writers before pause", expectedVersion: 7,
    });
  });

  it("keeps the generic failure for unrelated errors and rereads status", async () => {
    const active = { available: true, paused: false, reason: "writers active",
      version: 9, changedAt: "2026-10-19T00:00:00.000Z", changedByUserId: null };
    api.get.mockResolvedValue(active);
    api.update.mockRejectedValue(Object.assign(new Error("stale version"), {
      isAxiosError: true,
      response: { status: 409, data: { error: {
        details: { code: "LIVE_PAUSE_VERSION_CONFLICT" },
      } } },
    }));
    render(<I18nProvider><LiveExecutionPage /></I18nProvider>);
    expect(await screen.findByText("LIVE submissions active")).toBeInTheDocument();
    fireEvent.change(screen.getByRole("textbox"), { target: { value: "Stop writers before pause" } });
    fireEvent.click(screen.getByRole("button", { name: "Pause LIVE submissions" }));
    expect(await screen.findByRole("alert")).toHaveTextContent("Could not verify the change");
    await waitFor(() => expect(api.get).toHaveBeenCalledTimes(2));
    expect(screen.getByText("Version: 9")).toBeInTheDocument();
  });
});
