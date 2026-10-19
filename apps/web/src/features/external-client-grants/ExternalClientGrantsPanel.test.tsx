import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { I18nProvider } from "@/i18n/I18nProvider";
import ExternalClientGrantsPanel from "./ExternalClientGrantsPanel";

const listGrants = vi.hoisted(() => vi.fn());
const createGrant = vi.hoisted(() => vi.fn());
const revokeGrant = vi.hoisted(() => vi.fn());
const listBots = vi.hoisted(() => vi.fn());
const getGraph = vi.hoisted(() => vi.fn());
const getSubscription = vi.hoisted(() => vi.fn());
const listMarketUniverses = vi.hoisted(() => vi.fn());

vi.mock("./grants.api", () => ({
  listExternalClientGrants: listGrants,
  createExternalClientGrant: createGrant,
  revokeExternalClientGrant: revokeGrant,
}));
vi.mock("@/features/bots/services/bots.service", () => ({ listBots, getBotRuntimeGraph: getGraph }));
vi.mock("@/features/profile/services/subscription.service", () => ({ getProfileSubscription: getSubscription }));
vi.mock("@/features/markets/services/markets.service", () => ({ listMarketUniverses }));

const grant = {
  id: "grant-1", botId: "bot-1", clientLabel: "Local client", exchange: "BINANCE", marketType: "FUTURES",
  symbol: "BTCUSDT", action: "PLACE_LIVE_ORDER", maxActionQuoteAmount: "50.00",
  maxTotalQuoteAmount: "100.00", usedQuoteAmount: "0", maxActions: 2, usedActions: 0,
  expiresAt: "2030-01-01T00:00:00.000Z", revokedAt: null, createdAt: "2026-10-19T00:00:00.000Z",
};

beforeEach(() => {
  window.localStorage.setItem("cryptosparrow-locale", "en");
  window.history.pushState({}, "", "/dashboard/profile");
  listGrants.mockResolvedValue([]);
  listBots.mockResolvedValue([{ id: "bot-1", name: "LIVE bot", mode: "LIVE", isActive: true, liveOptIn: true,
    exchange: "BINANCE", marketType: "FUTURES",
    symbolGroup: { id: "group-1", symbols: ["BTCUSDT"], marketUniverse: { exchange: "BINANCE", marketType: "FUTURES" } } }]);
  getGraph.mockResolvedValue({ marketGroups: [
    { isEnabled: true, lifecycleStatus: "ACTIVE", symbolGroup: {
      id: "group-1", marketUniverseId: "universe-1", symbols: ["BTCUSDT"] } },
  ] });
  listMarketUniverses.mockResolvedValue([{ id: "universe-1", exchange: "BINANCE", marketType: "FUTURES" }]);
  getSubscription.mockResolvedValue({
    activePlanCode: "ADVANCED", activeSubscription: { id: "sub-1" },
    catalog: [{ code: "ADVANCED", isActive: true, entitlements: { features: { liveTrading: true } } }],
  });
  createGrant.mockResolvedValue({ grant, secret: "soar_ext_once_only" });
  revokeGrant.mockResolvedValue({ ...grant, revokedAt: "2026-10-19T12:00:00.000Z" });
});

afterEach(() => {
  vi.clearAllMocks();
  window.localStorage.clear();
  window.history.pushState({}, "", "/");
});

describe("external client grants panel", () => {
  it("creates with human password, reveals the secret once, then revokes explicitly", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", { configurable: true, value: { writeText } });
    const view = render(<I18nProvider><ExternalClientGrantsPanel /></I18nProvider>);

    await screen.findByRole("button", { name: "Create grant" });
    fireEvent.change(screen.getByLabelText("External client label"), { target: { value: "Local client" } });
    fireEvent.change(screen.getByLabelText("Bot"), { target: { value: "bot-1" } });
    fireEvent.change(screen.getByLabelText("Maximum per action (USDT)"), { target: { value: "50.00" } });
    fireEvent.change(screen.getByLabelText("Maximum total (USDT)"), { target: { value: "100.00" } });
    fireEvent.change(screen.getByLabelText("Maximum number of actions"), { target: { value: "2" } });
    fireEvent.change(screen.getByLabelText("Confirm with your account password"), { target: { value: "OwnerPassword" } });
    fireEvent.click(screen.getByRole("button", { name: "Create grant" }));

    await waitFor(() => expect(createGrant).toHaveBeenCalledWith(expect.objectContaining({
      botId: "bot-1", exchange: "BINANCE", marketType: "FUTURES", symbol: "BTCUSDT",
      action: "PLACE_LIVE_ORDER", maxActions: 2, ttlSeconds: 3600, password: "OwnerPassword",
    })));
    expect(screen.getByTestId("grant-secret")).toHaveTextContent("soar_ext_once_only");
    expect(screen.getByLabelText("Confirm with your account password")).toHaveValue("");
    fireEvent.click(screen.getByRole("button", { name: "Copy secret" }));
    await waitFor(() => expect(writeText).toHaveBeenCalledWith("soar_ext_once_only"));
    fireEvent.click(screen.getByRole("button", { name: "I saved it — close" }));
    expect(screen.queryByText("soar_ext_once_only")).not.toBeInTheDocument();
    expect(screen.getByText("Local client")).toBeInTheDocument();
    const storedValues = (storage: Storage) => Array.from({ length: storage.length }, (_, index) =>
      storage.getItem(storage.key(index) ?? ""));
    expect(JSON.stringify([...storedValues(localStorage), ...storedValues(sessionStorage)])).not.toContain("soar_ext_once_only");
    expect(window.location.href).not.toContain("soar_ext_once_only");

    view.unmount();
    listGrants.mockResolvedValue([grant]);
    render(<I18nProvider><ExternalClientGrantsPanel /></I18nProvider>);
    expect(await screen.findByText("Local client")).toBeInTheDocument();
    expect(screen.queryByText("soar_ext_once_only")).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Revoke grant" }));
    expect(revokeGrant).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole("button", { name: "Confirm revoke" }));
    await waitFor(() => expect(revokeGrant).toHaveBeenCalledWith("grant-1"));
    expect(await screen.findByText("Revoked")).toBeInTheDocument();
  });

  it("shows plan loss and disables creation while retaining the grant list", async () => {
    listGrants.mockResolvedValue([grant]);
    getSubscription.mockResolvedValue({ activePlanCode: null, activeSubscription: null, catalog: [] });
    render(<I18nProvider><ExternalClientGrantsPanel /></I18nProvider>);
    expect(await screen.findByText("Plan unavailable")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Create grant" })).toBeDisabled();
    expect(screen.getByText("Local client")).toBeInTheDocument();
  });

  it("marks retained grant context unverified after refresh fails", async () => {
    listGrants.mockResolvedValue([grant]);
    render(<I18nProvider><ExternalClientGrantsPanel /></I18nProvider>);
    expect(await screen.findByText("Configured · no client route")).toBeInTheDocument();
    listGrants.mockRejectedValue(new Error("network unavailable"));
    fireEvent.click(screen.getByRole("button", { name: "Refresh status" }));
    expect(await screen.findByText("Status unverified")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Create grant" })).not.toBeInTheDocument();
  });
});
