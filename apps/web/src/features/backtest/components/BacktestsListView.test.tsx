import { act, cleanup, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import BacktestsListView from "./BacktestsListView";
import { I18nProvider } from "@/i18n/I18nProvider";

const listBacktestRunsMock = vi.hoisted(() => vi.fn());

vi.mock("../services/backtests.service", () => ({
  listBacktestRuns: listBacktestRunsMock,
}));

describe("BacktestsListView loading UX", () => {
  afterEach(() => {
    cleanup();
    window.localStorage.removeItem("cryptosparrow-locale");
    window.history.pushState({}, "", "/");
  });

  const renderWithI18n = async () => {
    await act(async () => {
      render(
        <I18nProvider>
          <BacktestsListView />
        </I18nProvider>
      );
    });
    await waitFor(() => {
      expect(document.documentElement.lang).toBe(window.localStorage.getItem("cryptosparrow-locale") ?? "en");
    });
  };

  it("renders skeleton composition while runs list is loading", async () => {
    window.localStorage.setItem("cryptosparrow-locale", "en");
    window.history.pushState({}, "", "/dashboard/backtests/list");
    listBacktestRunsMock.mockReturnValue(new Promise(() => undefined));

    await renderWithI18n();

    expect(screen.getByLabelText("Loading KPI row")).toBeInTheDocument();
    expect(screen.getByLabelText("Loading table rows")).toBeInTheDocument();
  });

  it("renders Portuguese empty-state copy when locale is set to pt", async () => {
    window.localStorage.setItem("cryptosparrow-locale", "pt");
    window.history.pushState({}, "", "/dashboard/backtests/list");
    listBacktestRunsMock.mockResolvedValue([]);

    await renderWithI18n();

    expect(await screen.findByText("Sem execucoes de backtest")).toBeInTheDocument();
    expect(screen.getByText("Cria a primeira execucao para consultar resultados.")).toBeInTheDocument();
  });
});
