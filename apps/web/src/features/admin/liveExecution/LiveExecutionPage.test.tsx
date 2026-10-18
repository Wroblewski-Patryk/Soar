import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
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
  beforeEach(() => { api.get.mockReset(); api.update.mockReset(); });

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
});
