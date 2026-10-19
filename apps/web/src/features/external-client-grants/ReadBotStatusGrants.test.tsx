import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { I18nProvider } from "@/i18n/I18nProvider";
import ReadBotStatusGrants from "./ReadBotStatusGrants";

const listReadGrants = vi.hoisted(() => vi.fn());
const getReadGrant = vi.hoisted(() => vi.fn());
const createReadGrant = vi.hoisted(() => vi.fn());
const revokeReadGrant = vi.hoisted(() => vi.fn());
const listBots = vi.hoisted(() => vi.fn());
const getSubscription = vi.hoisted(() => vi.fn());

vi.mock("./readGrants.api", () => ({
  listExternalClientReadGrants: listReadGrants,
  getExternalClientReadGrant: getReadGrant,
  createExternalClientReadGrant: createReadGrant,
  revokeExternalClientReadGrant: revokeReadGrant,
}));
vi.mock("@/features/bots/services/bots.service", () => ({ listBots }));
vi.mock("@/features/profile/services/subscription.service", () => ({ getProfileSubscription: getSubscription }));

const grant = {
  id: "read-1", botId: "paper-bot", clientLabel: "Status reader", action: "READ_BOT_STATUS",
  expiresAt: "2030-01-01T00:00:00.000Z", revokedAt: null, createdAt: "2026-10-19T00:00:00.000Z",
};

beforeEach(() => {
  window.localStorage.setItem("cryptosparrow-locale", "en");
  window.history.pushState({}, "", "/dashboard/profile");
  listReadGrants.mockResolvedValue([]);
  listBots.mockResolvedValue([{ id: "paper-bot", name: "PAPER bot", mode: "PAPER" }]);
  getSubscription.mockResolvedValue({
    activePlanCode: "ADVANCED", activeSubscription: { id: "sub-1" },
    catalog: [{ code: "ADVANCED", isActive: true, entitlements: { features: { liveTrading: true } } }],
  });
  createReadGrant.mockResolvedValue({ grant, secret: "soar_read_once_only" });
  getReadGrant.mockResolvedValue(grant);
  revokeReadGrant.mockResolvedValue({ ...grant, revokedAt: "2026-10-19T12:00:00.000Z" });
});

afterEach(() => {
  vi.clearAllMocks();
  window.localStorage.clear();
  window.history.pushState({}, "", "/");
});

describe("READ_BOT_STATUS grant panel", () => {
  it("requires an explicit read-only choice, scopes one PAPER bot, and shows the secret once", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", { configurable: true, value: { writeText } });
    const view = render(<I18nProvider><ReadBotStatusGrants /></I18nProvider>);
    expect(screen.queryByRole("button", { name: "Create read-only grant" })).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Set up read-only grant" }));
    const create = await screen.findByRole("button", { name: "Create read-only grant" });
    expect(screen.getByText("Only READ_BOT_STATUS for the selected bot. No symbol, order action or trading limit is included.")).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText("Read-only client label"), { target: { value: "Status reader" } });
    fireEvent.change(screen.getByLabelText("Bot to read"), { target: { value: "paper-bot" } });
    fireEvent.change(screen.getByLabelText("Confirm read grant with your account password"), { target: { value: "OwnerPassword" } });
    fireEvent.click(create);

    await waitFor(() => expect(createReadGrant).toHaveBeenCalledWith({
      botId: "paper-bot", clientLabel: "Status reader", action: "READ_BOT_STATUS",
      ttlSeconds: 3600, password: "OwnerPassword",
    }));
    const dialog = await screen.findByRole("dialog", { name: "Save this read-only secret now" });
    expect(within(dialog).getByTestId("read-grant-secret")).toHaveTextContent("soar_read_once_only");
    expect(screen.getByLabelText("Confirm read grant with your account password")).toHaveValue("");
    const copy = within(dialog).getByRole("button", { name: "Copy read-only secret" });
    const close = within(dialog).getByRole("button", { name: "I saved it — close" });
    expect(copy).toHaveFocus();
    fireEvent.keyDown(document, { key: "Tab", shiftKey: true });
    expect(close).toHaveFocus();
    fireEvent.keyDown(document, { key: "Tab" });
    expect(copy).toHaveFocus();
    fireEvent.click(copy);
    await waitFor(() => expect(writeText).toHaveBeenCalledWith("soar_read_once_only"));
    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.queryByText("soar_read_once_only")).not.toBeInTheDocument();
    expect(create).toHaveFocus();
    expect(JSON.stringify(localStorage)).not.toContain("soar_read_once_only");
    view.unmount();

    listReadGrants.mockResolvedValue([grant]);
    render(<I18nProvider><ReadBotStatusGrants /></I18nProvider>);
    expect(await screen.findByText("Status reader")).toBeInTheDocument();
    expect(screen.queryByText("soar_read_once_only")).not.toBeInTheDocument();
    expect(screen.getByText("Read bot status only · no orders")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Check current details" }));
    await waitFor(() => expect(getReadGrant).toHaveBeenCalledWith("read-1"));
    expect(screen.queryByText("soar_read_once_only")).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Revoke read-only grant" }));
    expect(revokeReadGrant).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole("button", { name: "Confirm revoke" }));
    await waitFor(() => expect(revokeReadGrant).toHaveBeenCalledWith("read-1"));
    expect(await screen.findByText("Revoked")).toBeInTheDocument();
    expect(screen.queryByText("soar_read_once_only")).not.toBeInTheDocument();
  });

  it("shows expiry, load failure and plan loss without enabling creation", async () => {
    listReadGrants.mockResolvedValue([{ ...grant, expiresAt: "2020-01-01T00:00:00.000Z" }]);
    getSubscription.mockResolvedValue({ activePlanCode: null, activeSubscription: null, catalog: [] });
    render(<I18nProvider><ReadBotStatusGrants /></I18nProvider>);
    expect(await screen.findByText("Expired")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Set up read-only grant" }));
    expect(screen.getByRole("button", { name: "Create read-only grant" })).toBeDisabled();
    listReadGrants.mockRejectedValue(new Error("network"));
    fireEvent.click(screen.getByRole("button", { name: "Refresh read-only grants" }));
    expect(await screen.findByText("Could not refresh read-only grants. The displayed list may be stale.")).toBeInTheDocument();
    expect(screen.getByText("Expired")).toBeInTheDocument();
  });

  it("explains the read-only boundary in Polish", async () => {
    window.localStorage.setItem("cryptosparrow-locale", "pl");
    render(<I18nProvider><ReadBotStatusGrants /></I18nProvider>);
    expect(await screen.findByText("Grant tylko do odczytu statusu bota")).toBeInTheDocument();
    expect(screen.getByText(/Grant nie pozwala składać zleceń/)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Skonfiguruj grant tylko do odczytu" }));
    expect(screen.getByText(/Bez symbolu, składania zleceń i limitu handlowego/)).toBeInTheDocument();
  });
});
