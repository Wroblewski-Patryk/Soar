import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { I18nProvider } from "@/i18n/I18nProvider";

import BacktestsRunsTable from "./BacktestsRunsTable";

const deleteBacktestRunMock = vi.hoisted(() => vi.fn());

vi.mock("../services/backtests.service", () => ({
  deleteBacktestRun: deleteBacktestRunMock,
}));

describe("BacktestsRunsTable", () => {
  afterEach(() => {
    vi.clearAllMocks();
    window.localStorage.clear();
  });

  it("uses canonical preset actions for preview and delete", async () => {
    window.localStorage.setItem("cryptosparrow-locale", "pl");
    window.history.pushState({}, '', '/dashboard/backtests');
    render(
      <I18nProvider>
        <BacktestsRunsTable
          rows={[
            {
              id: "bt-1",
              strategyId: "str-1",
              strategyName: "EMA Pulse",
              markets: ["BTCUSDT", "ETHUSDT"],
              initialBalance: 2500,
              name: "Run #1",
              symbol: "BTCUSDT",
              timeframe: "5m",
              status: "COMPLETED",
              startedAt: "2026-04-18T10:00:00.000Z",
              finishedAt: "2026-04-18T10:10:00.000Z",
              notes: null,
              createdAt: "2026-04-18T10:00:00.000Z",
            },
          ]}
        />
      </I18nProvider>
    );

    expect(screen.getByText(/strategia|strategy/i)).toBeInTheDocument();
    expect(screen.getByText(/rynki|markets/i)).toBeInTheDocument();
    expect(screen.getByText(/balans startowy|init balance/i)).toBeInTheDocument();
    expect(screen.getByText("EMA Pulse")).toBeInTheDocument();
    expect(screen.getByText("BTCUSDT, ETHUSDT")).toBeInTheDocument();
    expect(screen.getByText(/2(\s| )?500/)).toBeInTheDocument();

    const previewLink = screen.getByRole("link", { name: /podglad run #1|preview run #1/i });
    const deleteButton = screen.getByRole("button", { name: /usun|delete/i });

    expect(previewLink).toHaveAttribute("href", "/dashboard/backtests/bt-1");
    expect(previewLink.className).toContain("text-accent");
    expect(deleteButton.className).toContain("text-error");
  });
});
