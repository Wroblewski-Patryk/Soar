import { act, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { I18nProvider } from "@/i18n/I18nProvider";

import BotsListTable from "./BotsListTable";

const listBotsMock = vi.hoisted(() => vi.fn());
const deleteBotMock = vi.hoisted(() => vi.fn());
const listStrategiesMock = vi.hoisted(() => vi.fn());

vi.mock("../services/bots.service", () => ({
  listBots: listBotsMock,
  deleteBot: deleteBotMock,
}));

vi.mock("@/features/strategies/api/strategies.api", () => ({
  listStrategies: listStrategiesMock,
}));

const renderWithI18n = () => {
  window.localStorage.setItem("cryptosparrow-locale", "pl");
  window.history.pushState({}, '', '/dashboard/bots');
  return render(
    <I18nProvider>
      <BotsListTable />
    </I18nProvider>
  );
};

const seedBotsList = () => {
  listStrategiesMock.mockResolvedValue([
    {
      id: "strat-1",
      name: "Trend Pulse",
      interval: "5m",
      leverage: 10,
    },
  ]);
  listBotsMock.mockResolvedValue([
    {
      id: "bot-1",
      name: "Paper Bot",
      mode: "PAPER",
      paperStartBalance: 10_000,
      exchange: "BINANCE",
      marketType: "FUTURES",
      positionMode: "ONE_WAY",
      strategyId: "strat-1",
      isActive: true,
      liveOptIn: false,
      maxOpenPositions: 1,
    },
    {
      id: "bot-2",
      name: "Second Paper Bot",
      mode: "PAPER",
      paperStartBalance: 8_000,
      exchange: "BINANCE",
      marketType: "FUTURES",
      positionMode: "ONE_WAY",
      strategyId: "strat-1",
      isActive: false,
      liveOptIn: false,
      maxOpenPositions: 1,
    },
  ]);
};

afterEach(() => {
  vi.clearAllMocks();
  window.localStorage.clear();
  window.history.pushState({}, "", "/");
});

describe("BotsListTable", () => {
  it("renders canonical list-table action links for runtime and edit form", async () => {
    listStrategiesMock.mockResolvedValue([
      {
        id: "strat-1",
        name: "Trend Pulse",
        interval: "5m",
        leverage: 10,
      },
    ]);
    listBotsMock.mockResolvedValue([
      {
        id: "bot-1",
        name: "Paper Bot",
        mode: "PAPER",
        paperStartBalance: 10_000,
        exchange: "BINANCE",
        marketType: "FUTURES",
        positionMode: "ONE_WAY",
        strategyId: "strat-1",
        isActive: true,
        liveOptIn: false,
        maxOpenPositions: 1,
      },
    ]);

    renderWithI18n();

    await waitFor(() => {
      expect(screen.getByText("Paper Bot")).toBeInTheDocument();
    });

    const runtimeLink = screen.getByRole("link", { name: /runtime operations|operacje runtime/i });
    const editLink = screen.getByRole("link", { name: /edit|edytuj/i });

    expect(runtimeLink).toHaveAttribute("href", "/dashboard/bots/bot-1/preview");
    expect(editLink).toHaveAttribute("href", "/dashboard/bots/bot-1/edit");
    expect(runtimeLink.className).toContain("text-accent");
    expect(editLink.className).toContain("text-info");
    expect(screen.queryByRole("link", { name: /asystent/i })).not.toBeInTheDocument();
  });

  it("shows placeholder badge for inherited unsupported exchange and supports filtering by exchange name", async () => {
    listStrategiesMock.mockResolvedValue([
      {
        id: "strat-2",
        name: "Placeholder Strategy",
        interval: "5m",
        leverage: 10,
      },
    ]);
    listBotsMock.mockResolvedValue([
      {
        id: "bot-okx",
        name: "OKX Bot",
        mode: "PAPER",
        paperStartBalance: 12_000,
        exchange: "BINANCE",
        marketType: "SPOT",
        positionMode: "ONE_WAY",
        strategyId: "strat-2",
        isActive: false,
        liveOptIn: false,
        maxOpenPositions: 1,
        symbolGroup: {
          id: "sg-okx",
          name: "OKX Scope",
          symbols: ["BTCUSDT"],
          marketUniverseId: "mu-okx",
          marketUniverse: {
            id: "mu-okx",
            name: "OKX Futures",
            exchange: "OKX",
            marketType: "FUTURES",
            baseCurrency: "USDT",
          },
        },
      },
      {
        id: "bot-binance",
        name: "Binance Bot",
        mode: "PAPER",
        paperStartBalance: 10_000,
        exchange: "BINANCE",
        marketType: "FUTURES",
        positionMode: "ONE_WAY",
        strategyId: "strat-2",
        isActive: true,
        liveOptIn: false,
        maxOpenPositions: 1,
      },
    ]);

    renderWithI18n();

    await waitFor(() => {
      expect(screen.getByText("OKX Bot")).toBeInTheDocument();
      expect(screen.getByText("Binance Bot")).toBeInTheDocument();
    });

    expect(screen.getByText("PLACEHOLDER")).toBeInTheDocument();

    fireEvent.change(screen.getByPlaceholderText(/Search bots|Szukaj botow/i), {
      target: { value: "okx" },
    });

    await waitFor(() => {
      expect(screen.getByText("OKX Bot")).toBeInTheDocument();
      expect(screen.queryByText("Binance Bot")).not.toBeInTheDocument();
    });
  });

  it("removes only the confirmed bot row after delete succeeds", async () => {
    seedBotsList();
    deleteBotMock.mockResolvedValue(undefined);

    renderWithI18n();

    await waitFor(() => {
      expect(screen.getByText("Paper Bot")).toBeInTheDocument();
      expect(screen.getByText("Second Paper Bot")).toBeInTheDocument();
    });

    const paperRow = screen.getByText("Paper Bot").closest("tr");
    expect(paperRow).not.toBeNull();
    const deleteButtons = within(paperRow as HTMLElement).getAllByRole("button", {
      name: /usuń|usun|delete/i,
    });
    fireEvent.click(deleteButtons[0]);
    const dialog = await screen.findByText(/"Paper Bot"/);
    expect(dialog.closest("dialog")).not.toBeNull();
    const modal = dialog.closest("dialog") as HTMLElement;

    await act(async () => {
      fireEvent.click(within(modal).getAllByText(/usuń|usun|delete/i).at(-1) as HTMLElement);
    });

    await waitFor(() => {
      expect(deleteBotMock).toHaveBeenCalledWith("bot-1");
      expect(screen.queryByText("Paper Bot")).not.toBeInTheDocument();
      expect(screen.getByText("Second Paper Bot")).toBeInTheDocument();
    });
  });

  it("keeps the bot row visible when delete fails", async () => {
    seedBotsList();
    deleteBotMock.mockRejectedValue(new Error("linked records"));

    renderWithI18n();

    await waitFor(() => {
      expect(screen.getByText("Paper Bot")).toBeInTheDocument();
    });

    const paperRow = screen.getByText("Paper Bot").closest("tr");
    expect(paperRow).not.toBeNull();
    const deleteButtons = within(paperRow as HTMLElement).getAllByRole("button", {
      name: /usuń|usun|delete/i,
    });
    fireEvent.click(deleteButtons[0]);
    const dialog = await screen.findByText(/"Paper Bot"/);
    expect(dialog.closest("dialog")).not.toBeNull();
    const modal = dialog.closest("dialog") as HTMLElement;
    await act(async () => {
      fireEvent.click(within(modal).getAllByText(/usuń|usun|delete/i).at(-1) as HTMLElement);
    });

    await waitFor(() => {
      expect(deleteBotMock).toHaveBeenCalledWith("bot-1");
      expect(screen.getByText("Paper Bot")).toBeInTheDocument();
      expect(screen.getByText("Second Paper Bot")).toBeInTheDocument();
    });
  });
});
