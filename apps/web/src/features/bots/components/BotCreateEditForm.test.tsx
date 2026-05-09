import { cleanup, fireEvent, render, screen, waitFor, act } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import BotCreateEditForm from "./BotCreateEditForm";
import { I18nProvider } from "@/i18n/I18nProvider";

const listStrategiesMock = vi.hoisted(() => vi.fn());
const listMarketUniversesMock = vi.hoisted(() => vi.fn());
const listWalletsMock = vi.hoisted(() => vi.fn());
const fetchApiKeysMock = vi.hoisted(() => vi.fn());
const createBotMock = vi.hoisted(() => vi.fn());
const updateBotMock = vi.hoisted(() => vi.fn());
const getBotMock = vi.hoisted(() => vi.fn());
const getBotRuntimeGraphMock = vi.hoisted(() => vi.fn());
const routerReplaceMock = vi.hoisted(() => vi.fn());
const routerPushMock = vi.hoisted(() => vi.fn());
const toastErrorMock = vi.hoisted(() => vi.fn());
const toastSuccessMock = vi.hoisted(() => vi.fn());

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    replace: routerReplaceMock,
    push: routerPushMock,
  }),
  usePathname: () => (typeof window === "undefined" ? "/" : window.location.pathname || "/"),
}));

vi.mock("@/features/strategies/api/strategies.api", () => ({
  listStrategies: listStrategiesMock,
}));

vi.mock("@/features/markets/services/markets.service", () => ({
  listMarketUniverses: listMarketUniversesMock,
}));

vi.mock("@/features/wallets/services/wallets.service", () => ({
  listWallets: listWalletsMock,
}));

vi.mock("@/features/profile/services/apiKeys.service", () => ({
  fetchApiKeys: fetchApiKeysMock,
}));

vi.mock("../services/bots.service", () => ({
  createBot: createBotMock,
  updateBot: updateBotMock,
  getBot: getBotMock,
  getBotRuntimeGraph: getBotRuntimeGraphMock,
}));

vi.mock("sonner", () => ({
  toast: {
    error: toastErrorMock,
    success: toastSuccessMock,
  },
}));

const renderWithI18n = async (props: { editId?: string | null } = {}) => {
  window.localStorage.setItem("cryptosparrow-locale", "en");
  window.history.pushState({}, "", props.editId ? `/dashboard/bots/${props.editId}/edit` : "/dashboard/bots/create");
  let view: ReturnType<typeof render>;
  await act(async () => {
    view = render(
      <I18nProvider>
        <BotCreateEditForm editId={props.editId ?? null} />
      </I18nProvider>
    );
  });
  await waitFor(() => {
    expect(document.documentElement.lang).toBe("en");
  });
  return view!;
};

const baseApiKey = {
  id: "k1",
  label: "Main key",
  exchange: "BINANCE" as const,
  apiKey: "ab********yz",
  apiSecret: "",
  syncExternalPositions: true,
  manageExternalPositions: false,
  createdAt: "2026-04-06T10:00:00.000Z",
};

const baseWallet = {
  id: "w1",
  name: "Paper wallet",
  mode: "PAPER" as const,
  exchange: "BINANCE" as const,
  marketType: "FUTURES" as const,
  baseCurrency: "USDT",
  paperInitialBalance: 10000,
  liveAllocationMode: null,
  liveAllocationValue: null,
  apiKeyId: null,
  createdAt: "2026-04-06T10:00:00.000Z",
  updatedAt: "2026-04-06T10:00:00.000Z",
};

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  window.localStorage.clear();
  window.history.pushState({}, "", "/");
  listStrategiesMock.mockReset();
  listMarketUniversesMock.mockReset();
  listWalletsMock.mockReset();
  fetchApiKeysMock.mockReset();
  createBotMock.mockReset();
  updateBotMock.mockReset();
  getBotMock.mockReset();
  getBotRuntimeGraphMock.mockReset();
  routerReplaceMock.mockReset();
  routerPushMock.mockReset();
  toastErrorMock.mockReset();
  toastSuccessMock.mockReset();
});

describe("BotCreateEditForm", () => {
  it("shows LIVE mode controls when wallet is LIVE with linked API key", async () => {
    listStrategiesMock.mockResolvedValue([
      { id: "s1", name: "Momentum", interval: "5m", leverage: 2, config: {} },
    ]);
    listMarketUniversesMock.mockResolvedValue([
      {
        id: "g1",
        name: "Core Futures",
        exchange: "BINANCE",
        marketType: "FUTURES",
        baseCurrency: "USDT",
        whitelist: ["BTCUSDT"],
        blacklist: [],
      },
    ]);
    listWalletsMock.mockResolvedValue([
      {
        ...baseWallet,
        id: "w-live",
        mode: "LIVE",
        apiKeyId: baseApiKey.id,
      },
    ]);
    fetchApiKeysMock.mockResolvedValue([baseApiKey]);

    await renderWithI18n();

    await waitFor(() => {
      expect(screen.getByTestId("wallet-context-summary")).toBeInTheDocument();
    });
    expect(screen.getByRole("heading", { name: "Bot setup" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "2. Market context" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "3. Strategy context" })).toBeInTheDocument();
    expect(screen.queryByLabelText("Bot mode")).not.toBeInTheDocument();
    expect(screen.queryByLabelText("Paper start balance")).not.toBeInTheDocument();
    expect(screen.getByText("Wallet:")).toBeInTheDocument();
    expect(screen.getByText("Paper wallet")).toBeInTheDocument();
    expect(screen.getByText("Mode:")).toBeInTheDocument();
    expect(screen.getByText("LIVE")).toBeInTheDocument();
    expect(screen.getByText("Venue context:")).toBeInTheDocument();
    expect(screen.getByText("BINANCE / FUTURES / USDT")).toBeInTheDocument();
    expect(screen.getByText("LIVE API key:")).toBeInTheDocument();
    expect(screen.getByText("Linked")).toBeInTheDocument();
    expect(screen.queryByText("Missing")).not.toBeInTheDocument();
    expect(screen.getByLabelText("Import and manage external exchange positions")).toBeInTheDocument();
    expect(screen.getAllByRole("checkbox")).toHaveLength(4);
  });

  it("shows validation copy and blocks create when active LIVE has no compatible key", async () => {
    listStrategiesMock.mockResolvedValue([
      { id: "s2", name: "Live Strategy", interval: "15m", leverage: 2, config: {} },
    ]);
    listMarketUniversesMock.mockResolvedValue([
      {
        id: "g2",
        name: "Binance Futures",
        exchange: "BINANCE",
        marketType: "FUTURES",
        baseCurrency: "USDT",
        whitelist: ["ETHUSDT"],
        blacklist: [],
      },
    ]);
    listWalletsMock.mockResolvedValue([
      {
        ...baseWallet,
        id: "w-live-missing-key",
        mode: "LIVE",
        apiKeyId: null,
      },
    ]);
    fetchApiKeysMock.mockResolvedValue([]);

    const { container } = await renderWithI18n();

    await waitFor(() => {
      expect(screen.getByLabelText("Name")).toBeInTheDocument();
    });

    fireEvent.change(screen.getByLabelText("Name"), { target: { value: "Live Runner" } });
    const form = container.querySelector("form");
    expect(form).not.toBeNull();
    fireEvent.submit(form as HTMLFormElement);

    await waitFor(() => {
      expect(toastErrorMock).toHaveBeenCalledWith(
        "Add at least one compatible LIVE API key for selected exchange before activating LIVE bot."
      );
    });
    expect(createBotMock).not.toHaveBeenCalled();
  });

  it("disables active toggle for unsupported exchange placeholder", async () => {
    listStrategiesMock.mockResolvedValue([
      { id: "s3", name: "Placeholder Strategy", interval: "1h", leverage: 2, config: {} },
    ]);
    listMarketUniversesMock.mockResolvedValue([
      {
        id: "g3",
        name: "OKX Futures",
        exchange: "OKX",
        marketType: "FUTURES",
        baseCurrency: "USDT",
        whitelist: ["BTCUSDT"],
        blacklist: [],
      },
    ]);
    listWalletsMock.mockResolvedValue([
      {
        ...baseWallet,
        id: "w-okx",
        exchange: "OKX",
      },
    ]);
    fetchApiKeysMock.mockResolvedValue([baseApiKey]);

    await renderWithI18n();

    await waitFor(() => {
      expect(screen.getByLabelText("Name")).toBeInTheDocument();
    });

    expect(screen.getByLabelText("Active")).toBeDisabled();
  });

  it("allows active toggle for Gate.io paper wallets when paper pricing is supported", async () => {
    listStrategiesMock.mockResolvedValue([
      { id: "s-gateio", name: "Gate.io Strategy", interval: "1h", leverage: 2, config: {} },
    ]);
    listMarketUniversesMock.mockResolvedValue([
      {
        id: "g-gateio",
        name: "Gate.io Futures",
        exchange: "GATEIO",
        marketType: "FUTURES",
        baseCurrency: "USDT",
        whitelist: ["BTCUSDT"],
        blacklist: [],
      },
    ]);
    listWalletsMock.mockResolvedValue([
      {
        ...baseWallet,
        id: "w-gateio",
        exchange: "GATEIO",
      },
    ]);
    fetchApiKeysMock.mockResolvedValue([]);

    await renderWithI18n();

    await waitFor(() => {
      expect(screen.getByLabelText("Name")).toBeInTheDocument();
    });

    expect(screen.getByLabelText("Active")).toBeEnabled();
  });

  it("submits wallet-first payload without legacy mode/paper fields", async () => {
    listStrategiesMock.mockResolvedValue([
      { id: "s4", name: "Wallet First", interval: "5m", leverage: 2, config: {} },
    ]);
    listMarketUniversesMock.mockResolvedValue([
      {
        id: "g4",
        name: "Binance Futures",
        exchange: "BINANCE",
        marketType: "FUTURES",
        baseCurrency: "USDT",
        whitelist: ["BTCUSDT"],
        blacklist: [],
      },
    ]);
    listWalletsMock.mockResolvedValue([baseWallet]);
    fetchApiKeysMock.mockResolvedValue([baseApiKey]);
    createBotMock.mockResolvedValue({ id: "bot-created" });

    const { container } = await renderWithI18n();

    await waitFor(() => {
      expect(screen.getByLabelText("Name")).toBeInTheDocument();
    });

    fireEvent.change(screen.getByLabelText("Name"), { target: { value: "Wallet payload bot" } });
    const form = container.querySelector("form");
    expect(form).not.toBeNull();
    fireEvent.submit(form as HTMLFormElement);

    await waitFor(() => {
      expect(createBotMock).toHaveBeenCalledTimes(1);
    });

    const payload = createBotMock.mock.calls[0][0] as Record<string, unknown>;
    expect(payload).toEqual(
      expect.objectContaining({
        name: "Wallet payload bot",
        walletId: "w1",
        strategyId: "s4",
        strategies: [{ strategyId: "s4", priority: 1, weight: 1, isEnabled: true }],
        marketGroupId: "g4",
        isActive: true,
        liveOptIn: false,
        manageExternalPositions: false,
        consentTextVersion: null,
      })
    );
    expect(payload).not.toHaveProperty("mode");
    expect(payload).not.toHaveProperty("paperStartBalance");
    expect(payload).not.toHaveProperty("apiKeyId");
    expect(routerReplaceMock).toHaveBeenCalledWith("/dashboard/bots/bot-created/edit");
  });

  it("submits ordered canonical strategy links with primary strategy first", async () => {
    listStrategiesMock.mockResolvedValue([
      { id: "s-primary", name: "Primary Momentum", interval: "5m", leverage: 2, config: {} },
      { id: "s-secondary", name: "Secondary Exit", interval: "15m", leverage: 1, config: {} },
    ]);
    listMarketUniversesMock.mockResolvedValue([
      {
        id: "g-multi",
        name: "Binance Futures",
        exchange: "BINANCE",
        marketType: "FUTURES",
        baseCurrency: "USDT",
        whitelist: ["BTCUSDT"],
        blacklist: [],
      },
    ]);
    listWalletsMock.mockResolvedValue([baseWallet]);
    createBotMock.mockResolvedValue({ id: "bot-multi" });

    const { container } = await renderWithI18n();

    await waitFor(() => {
      expect(screen.getByLabelText("Name")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByLabelText("Toggle strategy Secondary Exit"));
    fireEvent.change(screen.getByLabelText("Name"), { target: { value: "Multi strategy bot" } });
    const form = container.querySelector("form");
    expect(form).not.toBeNull();
    fireEvent.submit(form as HTMLFormElement);

    await waitFor(() => {
      expect(createBotMock).toHaveBeenCalledTimes(1);
    });
    expect(createBotMock.mock.calls[0][0]).toEqual(
      expect.objectContaining({
        strategyId: "s-primary",
        strategies: [
          { strategyId: "s-primary", priority: 1, weight: 1, isEnabled: true },
          { strategyId: "s-secondary", priority: 2, weight: 1, isEnabled: true },
        ],
      })
    );
  });

  it("prefills edit mode from direct bot context without runtime graph fallback", async () => {
    listStrategiesMock.mockResolvedValue([
      { id: "s-edit", name: "Direct strategy", interval: "15m", leverage: 3, config: {} },
    ]);
    listMarketUniversesMock.mockResolvedValue([
      {
        id: "g-edit",
        name: "Direct universe",
        exchange: "BINANCE",
        marketType: "FUTURES",
        baseCurrency: "USDT",
        whitelist: ["ETHUSDT"],
        blacklist: [],
      },
    ]);
    listWalletsMock.mockResolvedValue([
      { ...baseWallet, id: "w-edit", name: "Direct wallet" },
    ]);
    getBotMock.mockResolvedValue({
      id: "bot-edit",
      name: "Direct context bot",
      walletId: "w-edit",
      strategyId: "s-edit",
      symbolGroupId: "sg-edit",
      mode: "PAPER",
      paperStartBalance: 10000,
      exchange: "BINANCE",
      marketType: "FUTURES",
      positionMode: "ONE_WAY",
      isActive: true,
      liveOptIn: false,
      manageExternalPositions: true,
      maxOpenPositions: 1,
      wallet: { ...baseWallet, id: "w-edit", name: "Direct wallet" },
      strategy: {
        id: "s-edit",
        name: "Direct strategy",
        interval: "15m",
        leverage: 3,
        walletRisk: 2,
      },
      symbolGroup: {
        id: "sg-edit",
        name: "Direct group",
        symbols: ["ETHUSDT"],
        marketUniverseId: "g-edit",
        marketUniverse: {
          id: "g-edit",
          name: "Direct universe",
          exchange: "BINANCE",
          marketType: "FUTURES",
          baseCurrency: "USDT",
        },
      },
    });
    getBotRuntimeGraphMock.mockResolvedValue({
      bot: { id: "bot-edit" },
      marketGroups: [],
      legacyBotStrategies: [],
    });

    await renderWithI18n({ editId: "bot-edit" });

    await waitFor(() => {
      expect(screen.getByDisplayValue("Direct context bot")).toBeInTheDocument();
    });

    expect(screen.getByDisplayValue("Direct wallet (PAPER / BINANCE / FUTURES / USDT)")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Direct universe (BINANCE - FUTURES/USDT)")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Direct strategy")).toBeInTheDocument();
  });

  it("prefills edit mode from canonical runtime graph strategy links", async () => {
    listStrategiesMock.mockResolvedValue([
      { id: "s-graph-primary", name: "Graph primary", interval: "5m", leverage: 3, config: {} },
      { id: "s-graph-secondary", name: "Graph secondary", interval: "15m", leverage: 2, config: {} },
    ]);
    listMarketUniversesMock.mockResolvedValue([
      {
        id: "g-graph",
        name: "Graph universe",
        exchange: "BINANCE",
        marketType: "FUTURES",
        baseCurrency: "USDT",
        whitelist: ["ETHUSDT"],
        blacklist: [],
      },
    ]);
    listWalletsMock.mockResolvedValue([{ ...baseWallet, id: "w-graph", name: "Graph wallet" }]);
    getBotMock.mockResolvedValue({
      id: "bot-graph",
      name: "Graph context bot",
      walletId: "w-graph",
      strategyId: "legacy-direct",
      symbolGroupId: "sg-graph",
      mode: "PAPER",
      paperStartBalance: 10000,
      exchange: "BINANCE",
      marketType: "FUTURES",
      positionMode: "ONE_WAY",
      isActive: true,
      liveOptIn: false,
      manageExternalPositions: false,
      maxOpenPositions: 1,
      wallet: { ...baseWallet, id: "w-graph", name: "Graph wallet" },
      strategy: null,
      symbolGroup: {
        id: "sg-graph",
        name: "Graph group",
        symbols: ["ETHUSDT"],
        marketUniverseId: "g-graph",
        marketUniverse: null,
      },
    });
    getBotRuntimeGraphMock.mockResolvedValue({
      bot: { id: "bot-graph" },
      marketGroups: [
        {
          id: "bmg-graph",
          isEnabled: true,
          lifecycleStatus: "ACTIVE",
          strategies: [
            { id: "link-1", strategyId: "s-graph-primary", isEnabled: true },
            { id: "link-2", strategyId: "s-graph-secondary", isEnabled: true },
          ],
        },
      ],
      legacyBotStrategies: [],
    });

    await renderWithI18n({ editId: "bot-graph" });

    await waitFor(() => {
      expect(screen.getByDisplayValue("Graph context bot")).toBeInTheDocument();
    });

    expect(screen.getByDisplayValue("Graph primary")).toBeInTheDocument();
    expect(screen.getByLabelText("Toggle strategy Graph primary")).toBeChecked();
    expect(screen.getByLabelText("Toggle strategy Graph secondary")).toBeChecked();
  });
});
